# 入力API設計（将来候補）

対象: MVP後に検討する管理画面・入力API

この文書は現時点の実装契約ではない。公開読み取りAPIとは責務を分離し、
将来の認証・認可付き管理画面で利用する候補を整理する。

現行の `apps/api` には、この文書に記載する `POST` / `PATCH` のエンドポイントは存在しない。
本書の内容は、現在仕様として実装済み・実装予定と扱わず、将来構想として再評価する。

## 方針

- 入力APIは公開APIと責務を分離する
- MVPでは実装対象外とする
- 認証・認可を前提としたAPIとする
- URLは `/api/me/...` を基本とする

## 1. 試合予定登録

- 候補
  - `POST /api/me/teams/{teamId}/games`
- 入力項目例
  - `seasonId`
  - `tournamentId`
  - `stadiumId`
  - `gameDate`
  - `startTime`
  - `opponentName`
  - `homeAway`
  - `gameType`
  - `note`
- 方針
  - 試合予定だけでも登録できる
  - 得点や勝敗は未入力でよい
  - `runsFor` / `runsAgainst` / `result` は後から更新する

## 2. 試合結果更新

- 候補
  - `PATCH /api/me/teams/{teamId}/games/{gameId}`
- 入力項目例
  - `runsFor`
  - `runsAgainst`
  - `result`
  - `weather`
  - `note`
- 方針
  - 予定登録後に結果だけ更新できる

## 3. 出場選手登録

- 候補
  - `POST /api/me/teams/{teamId}/games/{gameId}/participants`
- 入力項目例
  - `playerId`
  - `displayName`
  - `uniformNumber`
  - `battingOrder`
  - `position`
  - `isStarter`
  - `isGuest`
- 方針
  - `playerId` がなくても助っ人として登録できる
  - `displayName` は必須

## 4. 成績登録

- 候補
  - `POST /api/me/teams/{teamId}/games/{gameId}/batting-lines`
  - `POST /api/me/teams/{teamId}/games/{gameId}/pitching-lines`
- 方針
  - 試合単位で打撃成績・投手成績を登録できる
  - 入力しやすさを優先したAPI設計とする
  - 公開APIとは責務を分離する
