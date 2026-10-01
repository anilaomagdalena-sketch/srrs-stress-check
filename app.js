import { ITEMS } from "./items.js";
import { total, band } from "./score.js";

const list = document.getElementById("items");
const totalEl = document.getElementById("total");
const countEl = document.getElementById("count");
const resultEl = document.getElementById("result");
const resultScoreEl = document.getElementById("result-score");
const resultBandEl = document.getElementById("result-band");
const resultGuideEl = document.getElementById("result-guide");
const resultCommentEl = document.getElementById("result-comment");

function renderItems() {
  for (const item of ITEMS) {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "item";
    input.value = String(item.id);

    const label = document.createElement("span");
    label.className = "item-label";
    label.textContent = item.label;

    const score = document.createElement("span");
    score.className = "item-score";
    score.textContent = `${item.score}点`;

    const row = document.createElement("label");
    row.className = "item";
    row.append(input, label, score);

    const li = document.createElement("li");
    li.append(row);
    list.append(li);
  }
}

// 状態は持たず、毎回チェックボックスそのものを読む。
// ブラウザが「戻る」や再読み込みでチェックを復元しても、合計がずれない。
function checkedIds() {
  return [...list.querySelectorAll("input:checked")].map((input) => Number(input.value));
}

function renderResult(score) {
  const current = band(score);
  resultEl.dataset.band = current.key;
  resultScoreEl.textContent = String(score);
  resultBandEl.textContent = `${current.name}（${current.range}）`;
  resultGuideEl.textContent = current.guide;
  resultGuideEl.hidden = current.guide === "";
  resultCommentEl.textContent = current.comment;
}

function update() {
  const ids = checkedIds();
  const score = total(ids);
  totalEl.textContent = String(score);
  countEl.textContent = String(ids.length);
  if (!resultEl.hidden) renderResult(score);
}

document.getElementById("show-result").addEventListener("click", () => {
  resultEl.hidden = false;
  update();
  resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("reset").addEventListener("click", () => {
  for (const input of list.querySelectorAll("input:checked")) input.checked = false;
  resultEl.hidden = true;
  update();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

list.addEventListener("change", update);
window.addEventListener("pageshow", update);

renderItems();
update();
