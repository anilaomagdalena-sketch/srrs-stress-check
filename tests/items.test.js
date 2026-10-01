import { test } from "node:test";
import assert from "node:assert/strict";
import { ITEMS } from "../items.js";

// 原典（Holmes & Rahe, 1967）の順位どおりの点数。打ち間違いをここで止める。
const EXPECTED_SCORES = [
  100, 73, 65, 63, 63, 53, 50, 47, 45, 45,
  44, 40, 39, 39, 39, 38, 37, 36, 35, 31,
  30, 29, 29, 29, 28, 26, 26, 25, 24, 23,
  20, 20, 20, 19, 19, 18, 17, 16, 15, 15,
  13, 12, 11,
];

test("項目は43件ある", () => {
  assert.equal(ITEMS.length, 43);
});

test("idは1から43まで順に並ぶ", () => {
  assert.deepEqual(
    ITEMS.map((item) => item.id),
    Array.from({ length: 43 }, (_, i) => i + 1),
  );
});

test("点数は原典の順位どおり", () => {
  assert.deepEqual(ITEMS.map((item) => item.score), EXPECTED_SCORES);
});

test("全項目の合計は1466点", () => {
  assert.equal(ITEMS.reduce((sum, item) => sum + item.score, 0), 1466);
});

test("項目名は空でなく、重複しない", () => {
  const labels = ITEMS.map((item) => item.label);
  for (const label of labels) {
    assert.equal(typeof label, "string");
    assert.ok(label.trim().length > 0);
  }
  assert.equal(new Set(labels).size, 43);
});

test("著者が指定した訳語になっている", () => {
  const labelOf = (id) => ITEMS.find((item) => item.id === id).label;
  assert.equal(labelOf(1), "配偶者の死");
  assert.equal(labelOf(5), "家族の死");
  assert.equal(labelOf(8), "失業");
  assert.equal(labelOf(9), "夫婦の和解（別居や不和からの仲直り）");
});
