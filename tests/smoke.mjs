// 本物のChromeで画面を操作して確かめる通しテスト。
// 使い方: ~/.bun/bin/bun tests/smoke.mjs  （Node 22以降なら node tests/smoke.mjs でも動く）
// 簡易サーバーとChromeはこのスクリプトが起動し、終わったら止める。
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CHROME =
  process.env.CHROME ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const WEB_PORT = 8765;
const CDP_PORT = 9333;
const BASE = `http://127.0.0.1:${WEB_PORT}/`;
const SHOT_DIR = tmpdir();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(url) {
  for (let i = 0; i < 50; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {
      // まだ起動していない
    }
    await sleep(200);
  }
  throw new Error(`起動しない: ${url}`);
}

const server = spawn(
  "python3",
  ["-m", "http.server", String(WEB_PORT), "--bind", "127.0.0.1", "--directory", ROOT],
  { stdio: "ignore" },
);
const profile = mkdtempSync(join(tmpdir(), "srrs-smoke-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${CDP_PORT}`,
    "--remote-allow-origins=*",
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "about:blank",
  ],
  { stdio: "ignore" },
);

try {
  await waitFor(`${BASE}index.html`);
  const targets = await (await waitFor(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
  const page = targets.find((target) => target.type === "page");
  assert.ok(page, "Chromeのページが見つからない");

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  let seq = 0;
  const pending = new Map();
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = ++seq;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  const evaluate = async (expression) => {
    const message = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (message.result.exceptionDetails) {
      const detail = message.result.exceptionDetails;
      throw new Error(detail.exception?.description ?? detail.text);
    }
    return message.result.result.value;
  };
  const setWidth = (width) =>
    send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true,
    });
  const setScheme = (scheme) =>
    send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-color-scheme", value: scheme }],
    });
  const background = () =>
    evaluate(`getComputedStyle(document.body).backgroundColor`);
  const screenshot = async (name) => {
    const message = await send("Page.captureScreenshot", { format: "png" });
    const file = join(SHOT_DIR, name);
    writeFileSync(file, Buffer.from(message.result.data, "base64"));
    console.log(`  画面写真: ${file}`);
  };
  const text = (selector) =>
    evaluate(`document.querySelector(${JSON.stringify(selector)}).textContent`);
  const isHidden = (selector) =>
    evaluate(`document.querySelector(${JSON.stringify(selector)}).hidden`);
  const click = (selector) =>
    evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const clickItem = (index) =>
    evaluate(`document.querySelectorAll("#items input")[${index}].click()`);
  const step = (name) => console.log(`- ${name}`);

  await send("Page.enable");
  await setWidth(375);
  await setScheme("light");
  await send("Page.navigate", { url: `${BASE}index.html` });
  for (let i = 0; i < 50; i++) {
    const count = await evaluate(`document.querySelectorAll("#items input").length`);
    if (count === 43) break;
    await sleep(100);
  }

  step("開いた直後: 43項目、0点、結果は隠れている");
  assert.equal(await evaluate(`document.querySelectorAll("#items input").length`), 43);
  assert.equal(await text("#total"), "0");
  assert.equal(await text("#count"), "0");
  assert.equal(await isHidden("#result"), true);
  assert.equal(
    await evaluate(`document.querySelector("#items .item-label").textContent`),
    "配偶者の死",
  );

  step("幅375px: 横スクロールが出ない、行は44px以上");
  assert.equal(
    await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`),
    true,
  );
  const minRow = await evaluate(
    `Math.min(...[...document.querySelectorAll(".item")].map((el) => el.getBoundingClientRect().height))`,
  );
  assert.ok(minRow >= 44, `行の高さが足りない: ${minRow}px`);
  await screenshot("srrs-smoke-list.png");

  step("端末の設定に合わせてライトとダークが切り替わる");
  assert.equal(await background(), "rgb(246, 244, 238)");
  await setScheme("dark");
  assert.equal(await background(), "rgb(18, 24, 29)");
  await screenshot("srrs-smoke-list-dark.png");
  await setScheme("light");

  step("幅320px: 横スクロールが出ない、行は44px以上");
  await setWidth(320);
  assert.equal(
    await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`),
    true,
  );
  const minRowNarrow = await evaluate(
    `Math.min(...[...document.querySelectorAll(".item")].map((el) => el.getBoundingClientRect().height))`,
  );
  assert.ok(minRowNarrow >= 44, `行の高さが足りない: ${minRowNarrow}px`);
  await setWidth(375);

  step("キーボードで移った項目が合計バーの下に隠れない");
  const hiddenRows = await evaluate(`(() => {
    const barTop = () => document.querySelector(".bar").getBoundingClientRect().top;
    let hidden = 0;
    for (const input of document.querySelectorAll("#items input")) {
      input.focus();
      if (input.closest(".item").getBoundingClientRect().bottom > barTop() + 1) hidden++;
    }
    document.activeElement.blur();
    window.scrollTo(0, 0);
    return hidden;
  })()`);
  assert.equal(hiddenRows, 0, `バーの下に隠れる行がある: ${hiddenRows}行`);

  step("チェック0件で結果を見る: 0点・低め、目安の数字なし、注記4件");
  await click("#show-result");
  assert.equal(await isHidden("#result"), false);
  assert.equal(await text("#result-score"), "0");
  assert.equal(await evaluate(`document.querySelector("#result").dataset.band`), "low");
  assert.equal(await text("#result-band"), "低め（200点未満）");
  assert.equal(await isHidden("#result-guide"), true);
  assert.ok((await text("#result-comment")).length > 0);
  assert.equal(await evaluate(`document.querySelectorAll("#result .notes li").length`), 4);

  step("やり直す: 結果が隠れる");
  await click("#reset");
  assert.equal(await isHidden("#result"), true);

  step("配偶者の死と離婚にチェック: 173点・2件");
  await clickItem(0);
  await clickItem(1);
  assert.equal(await text("#total"), "173");
  assert.equal(await text("#count"), "2");

  step("結果を見る: 173点・低め");
  await click("#show-result");
  assert.equal(await text("#result-score"), "173");
  assert.equal(await evaluate(`document.querySelector("#result").dataset.band`), "low");
  assert.equal(await evaluate(`document.activeElement.id`), "result-title");

  step("結果を出したままチェックを足す: 238点・中くらいに変わる");
  await clickItem(2);
  assert.equal(await text("#total"), "238");
  assert.equal(await text("#result-score"), "238");
  assert.equal(await evaluate(`document.querySelector("#result").dataset.band`), "mid");
  assert.equal(await text("#result-band"), "中くらい（200〜299点）");
  assert.equal(await isHidden("#result-guide"), false);
  assert.ok((await text("#result-guide")).includes("約50%"));

  step("さらに足す: 301点・高めに変わる");
  await clickItem(3);
  assert.equal(await text("#result-score"), "301");
  assert.equal(await evaluate(`document.querySelector("#result").dataset.band`), "high");
  assert.equal(await text("#result-band"), "高め（300点以上）");
  assert.ok((await text("#result-guide")).includes("約80%"));
  assert.ok((await text("#result-comment")).includes("医療機関"));
  await evaluate(`document.querySelector("#result").scrollIntoView()`);
  await screenshot("srrs-smoke-result.png");
  await setScheme("dark");
  await screenshot("srrs-smoke-result-dark.png");
  await setScheme("light");

  step("チェックを外す: 238点・中くらいに戻る");
  await clickItem(3);
  assert.equal(await text("#result-score"), "238");
  assert.equal(await evaluate(`document.querySelector("#result").dataset.band`), "mid");

  step("やり直す: 全チェックが外れ、0点、結果は隠れる");
  await click("#reset");
  assert.equal(await evaluate(`document.querySelectorAll("#items input:checked").length`), 0);
  assert.equal(await text("#total"), "0");
  assert.equal(await text("#count"), "0");
  assert.equal(await isHidden("#result"), true);

  step("ブラウザがチェックを復元したとき: 合計が実際のチェックに合う");
  await evaluate(`(() => {
    document.querySelectorAll("#items input")[42].checked = true;
    window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true }));
  })()`);
  assert.equal(await text("#total"), "11");
  assert.equal(await text("#count"), "1");

  step("通信も保存もしていない");
  const resources = await evaluate(
    `performance.getEntriesByType("resource").map((entry) => entry.name)`,
  );
  for (const url of resources) {
    assert.ok(url.startsWith(BASE), `外部への通信がある: ${url}`);
  }
  assert.equal(await evaluate(`localStorage.length`), 0);
  assert.equal(await evaluate(`sessionStorage.length`), 0);
  assert.equal(await evaluate(`document.cookie`), "");

  ws.close();
  console.log("通しテスト: すべて通過");
} finally {
  chrome.kill();
  server.kill();
  await sleep(300);
  rmSync(profile, { recursive: true, force: true });
}
