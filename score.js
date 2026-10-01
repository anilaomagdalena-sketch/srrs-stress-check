import { ITEMS } from "./items.js";

const SCORE_BY_ID = new Map(ITEMS.map((item) => [item.id, item.score]));

// 区分ごとの文言はここだけに置く。min の昇順に並べること。
export const BANDS = [
  {
    key: "low",
    min: 0,
    name: "低め",
    range: "200点未満",
    guide: "",
    comment:
      "合計点は低めの区分でした。ただ、点数が低くても、ひとつの出来事が大きくこたえることはあります。点数に出ない疲れもあるので、体の声は引き続き聞いてあげてください。",
  },
  {
    key: "mid",
    min: 200,
    name: "中くらい",
    range: "200〜299点",
    guide:
      "ホームズらの研究では、この点数帯の人の約50%が、その後に心身の不調を経験したと報告されています。",
    comment:
      "この1年、いろいろありましたね。変化が重なると、うれしい出来事でも心身には負担がかかります。睡眠と食事、休む時間を意識して確保してみてください。",
  },
  {
    key: "high",
    min: 300,
    name: "高め",
    range: "300点以上",
    guide:
      "ホームズらの研究では、この点数帯の人の約80%が、その後に心身の不調を経験したと報告されています。",
    comment:
      "かなり大きな変化が重なった1年でした。よくここまで来られたと思います。眠れない、食欲がない、気分が晴れないといった状態が続いているなら、一人で抱えず、医療機関や相談窓口を頼ってください。",
  },
];

// 同じ出来事は1回と数える。存在しないidは0点として扱う。
export function total(checkedIds) {
  let sum = 0;
  for (const id of new Set(checkedIds)) {
    sum += SCORE_BY_ID.get(id) ?? 0;
  }
  return sum;
}

export function band(score) {
  let result = BANDS[0];
  for (const candidate of BANDS) {
    if (score >= candidate.min) result = candidate;
  }
  return result;
}
