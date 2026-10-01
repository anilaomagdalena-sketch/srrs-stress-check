// ホームズとレイの社会的再適応評価尺度（Holmes & Rahe, 1967）の43項目。
// id は原典の順位。項目名は原典の英語からの独自訳で、行末のコメントが原典の表記。
export const ITEMS = [
  { id: 1, label: "配偶者の死", score: 100 }, // Death of spouse
  { id: 2, label: "離婚", score: 73 }, // Divorce
  { id: 3, label: "夫婦の別居", score: 65 }, // Marital separation
  { id: 4, label: "刑務所などへの収容", score: 63 }, // Jail term
  { id: 5, label: "家族の死", score: 63 }, // Death of close family member
  { id: 6, label: "自分のけがや病気", score: 53 }, // Personal injury or illness
  { id: 7, label: "結婚", score: 50 }, // Marriage
  { id: 8, label: "失業", score: 47 }, // Fired at work
  { id: 9, label: "夫婦の和解（別居や不和からの仲直り）", score: 45 }, // Marital reconciliation
  { id: 10, label: "退職・引退", score: 45 }, // Retirement
  { id: 11, label: "家族の健康状態の変化", score: 44 }, // Change in health of family member
  { id: 12, label: "妊娠", score: 40 }, // Pregnancy
  { id: 13, label: "性生活の問題", score: 39 }, // Sex difficulties
  { id: 14, label: "新しい家族が増える", score: 39 }, // Gain of new family member
  { id: 15, label: "仕事上の再調整（合併・再編など）", score: 39 }, // Business readjustment
  { id: 16, label: "経済状態の変化", score: 38 }, // Change in financial state
  { id: 17, label: "親しい友人の死", score: 37 }, // Death of close friend
  { id: 18, label: "職種の変更（転職・配置転換）", score: 36 }, // Change to different line of work
  { id: 19, label: "配偶者との口論の回数の変化", score: 35 }, // Change in number of arguments with spouse
  { id: 20, label: "高額の借金（住宅ローンなど）", score: 31 }, // Mortgage over $10,000
  { id: 21, label: "担保・ローンの差し押さえ", score: 30 }, // Foreclosure of mortgage or loan
  { id: 22, label: "仕事上の責任の変化", score: 29 }, // Change in responsibilities at work
  { id: 23, label: "子どもが家を離れる", score: 29 }, // Son or daughter leaving home
  { id: 24, label: "義理の家族とのトラブル", score: 29 }, // Trouble with in-laws
  { id: 25, label: "個人的な大きな成功", score: 28 }, // Outstanding personal achievement
  { id: 26, label: "配偶者が仕事を始める・辞める", score: 26 }, // Wife begins or stops work
  { id: 27, label: "入学・卒業", score: 26 }, // Begin or end school
  { id: 28, label: "生活環境の変化", score: 25 }, // Change in living conditions
  { id: 29, label: "個人的な習慣を改める", score: 24 }, // Revision of personal habits
  { id: 30, label: "上司とのトラブル", score: 23 }, // Trouble with boss
  { id: 31, label: "勤務時間や労働条件の変化", score: 20 }, // Change in work hours or conditions
  { id: 32, label: "引っ越し", score: 20 }, // Change in residence
  { id: 33, label: "転校", score: 20 }, // Change in schools
  { id: 34, label: "余暇の過ごし方の変化", score: 19 }, // Change in recreation
  { id: 35, label: "宗教活動の変化", score: 19 }, // Change in church activities
  { id: 36, label: "社会的な活動の変化", score: 18 }, // Change in social activities
  { id: 37, label: "少額の借金（車や家電のローンなど）", score: 17 }, // Mortgage or loan less than $10,000
  { id: 38, label: "睡眠習慣の変化", score: 16 }, // Change in sleeping habits
  { id: 39, label: "家族が集まる回数の変化", score: 15 }, // Change in number of family get-togethers
  { id: 40, label: "食習慣の変化", score: 15 }, // Change in eating habits
  { id: 41, label: "長期休暇", score: 13 }, // Vacation
  { id: 42, label: "クリスマスなど大きな年中行事", score: 12 }, // Christmas
  { id: 43, label: "軽い法律違反（交通違反など）", score: 11 }, // Minor violations of the law
];
