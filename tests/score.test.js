import { test } from "node:test";
import assert from "node:assert/strict";
import { BANDS, total, band } from "../score.js";

test("チェックなしは0点", () => {
  assert.equal(total([]), 0);
});

test("配偶者の死と離婚で173点", () => {
  assert.equal(total([1, 2]), 173);
});

test("全項目で1466点", () => {
  assert.equal(total(Array.from({ length: 43 }, (_, i) => i + 1)), 1466);
});

test("Setを渡しても合計できる", () => {
  assert.equal(total(new Set([42, 43])), 23);
});

test("同じidが重なっても1回分だけ数える", () => {
  assert.equal(total([1, 1, 1]), 100);
});

test("存在しないidは無視して落ちない", () => {
  assert.equal(total([1, 0, 44, -1, NaN, 2.5]), 100);
});

test("区分の境目", () => {
  assert.equal(band(0).key, "low");
  assert.equal(band(199).key, "low");
  assert.equal(band(200).key, "mid");
  assert.equal(band(299).key, "mid");
  assert.equal(band(300).key, "high");
  assert.equal(band(1466).key, "high");
});

test("区分は3つで、名前と点数の範囲を持つ", () => {
  assert.deepEqual(
    BANDS.map((b) => [b.key, b.min, b.name, b.range]),
    [
      ["low", 0, "低め", "200点未満"],
      ["mid", 200, "中くらい", "200〜299点"],
      ["high", 300, "高め", "300点以上"],
    ],
  );
});

test("目安の数字は中くらいと高めだけに出す", () => {
  assert.equal(band(0).guide, "");
  assert.ok(band(200).guide.includes("約50%"));
  assert.ok(band(300).guide.includes("約80%"));
});

test("目安はホームズらの研究として書き、1967年の論文とは書かない", () => {
  for (const b of [band(200), band(300)]) {
    assert.ok(b.guide.includes("ホームズらの研究"));
    assert.ok(!b.guide.includes("1967"));
  }
});

test("どの区分にもひとことがあり、高めは相談を勧める", () => {
  for (const b of BANDS) {
    assert.ok(b.comment.trim().length > 0);
  }
  assert.ok(band(300).comment.includes("医療機関"));
});
