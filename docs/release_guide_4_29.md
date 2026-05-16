# 4月29日 正式ローンチ公開ガイド

このドキュメントは、WEC Sprint Series の正式ローンチ（2026年4月29日）時に、すべての新機能を一括で公開するための手順書です。

## 🚀 実行用プロンプト
4月29日当日、AIアシスタントに以下のテキストをそのまま送ってください。

---
**【プロンプト】**
`/docs/release_guide_4_29.md` に基づき、本日（4月29日）の正式ローンチ公開作業を実行してください。

以下の変更をすべて一括で適用してください：
1. **ナビゲーションバーの完全公開**: `Navbar.jsx` のコメントを解除し、RESULTS, REGULATIONS を有効化。さらに「AI SETUP」をメニューに追加。
2. **ルーティングの有効化**: `App.jsx` のコメントを解除し、すべてのページへのアクセスを許可。AI SETUP のURLを `/setup-engineer` に変更。
3. **トップページを Season 3 仕様に**: `Home.jsx` の `latestSeason` を `Vol3` に変更。非表示にしていた「Season 3 Time Attack」セクションを最上部に復活。
4. **リザルト詳細の更新**: `Results.jsx` の `availableSeasons` に `Vol3` を追加し、初期表示を `Vol3` に設定。
5. **最終確認**: `regulations.js` のプロテスト期限が「レースの翌日中」になっていることを確認した上で、レギュレーションページを公開。

作業完了後、本番環境（GitHub/Vercel）へプッシュして保存してください。
---

## 🛠 具体的な修正箇所（テクニカル詳細）

### 1. Navbar.jsx
- `RESULTS`, `REGULATIONS` のコメント解除。
- `AI SETUP` (リンク先: `/setup-engineer`) の追加。

### 2. App.jsx
- `Results`, `Regulations` の Route コメント解除。
- `SetupTool` の Route を `/setup-engineer` に更新。

### 3. Home.jsx
- `const latestSeason = "Vol3";` への変更。
- `TimeAttackResults` コンポーネントのインポートとセクションの復活（Season 3 のデータ `timeAttackData["Vol3"][1]` を参照）。

### 4. Results.jsx
- `const availableSeasons = ["Vol1", "Vol2", "Vol3"];` への変更。
- `useState` の初期値を `Vol3` に統一。

---
**作成日**: 2026年4月26日
**ステータス**: 準備完了
