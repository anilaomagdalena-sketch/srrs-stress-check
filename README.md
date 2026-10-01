# この1年のストレスチェック

ホームズとレイの社会的再適応評価尺度（Social Readjustment Rating Scale, 1967）の43項目にチェックを入れると、過去1年間の合計点と目安が分かるウェブページです。

## 特徴

- 入力した内容は端末の中で計算するだけで、どこにも送信せず、保存もしません。
- アクセス解析、外部フォント、外部スクリプトは入れていません。
- HTML・CSS・JavaScriptだけで動きます。ビルドは不要です。
- 端末の設定に合わせて、ライトとダークの配色が切り替わります。

## 注意

結果は目安で、診断ではありません。気になる症状があるときは、点数にかかわらず医療機関に相談してください。

## 手元で動かす

    python3 -m http.server 8000

ブラウザで http://localhost:8000/ を開きます。ファイルを直接開く（file://）と動きません。

## テスト

    node --test tests/        # または bun test
    node tests/smoke.mjs      # 通しテスト。Google Chromeが必要

## 文言を直すとき

- 項目名と点数: `items.js`
- 区分ごとの目安とひとこと: `score.js` の `BANDS`
- 説明、注記、出典: `index.html`

## 出典

Holmes, T. H., & Rahe, R. H. (1967). The Social Readjustment Rating Scale. *Journal of Psychosomatic Research*, 11(2), 213–221.

項目名は原典の英語からの訳です。
