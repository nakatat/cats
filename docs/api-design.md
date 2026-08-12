# API設計

対象: 新琴似CATS 非公式公開サイト + 公開読み取り API
位置づけ: [画面・サイト方針](new-site-plan.md)、[ドメインモデル](domain-model.md)、[DB設計](database-design.md) を踏まえた公開 API 設計。
前提: 現在のMVPは公開読み取りAPIのみを実装し、管理画面・入力API・認証は実装対象外とする。

## 1. API設計の基本方針

- 外部公開URLは `/api/...` とする
- Controller の `@RequestMapping` には `/api` を書かず、`spring.mvc.servlet.path=/api` で付与する
- `/api/public` は使わない
- MVPでは認証なしの公開読み取りAPIを優先する
- 現在実装している業務APIは `GET` のみで、POST/PATCH/PUT/DELETEの入力APIは存在しない
- 公開APIは `/api/teams/{teamSlug}/...` を基本にする
- DB行をそのまま返さず、画面向けDTOを返す
- フロントエンドは表示に集中し、率やランキングはAPI側で計算する
- 管理・入力APIはMVP対象外とし、詳細は [入力API設計](input-api-design.md) を参照する
- 実装の正確なJSONスキーマはControllerのOpenAPI定義と生成済み型を正とし、この文書では公開上の意味と利用ルールを定義する

## 2. 公開APIエンドポイント一覧

- `GET /api/teams/{teamSlug}`
- `GET /api/teams/{teamSlug}/summary`
- `GET /api/teams/{teamSlug}/seasons`
- `GET /api/teams/{teamSlug}/games`
- `GET /api/teams/{teamSlug}/games/{gameId}`
- `GET /api/teams/{teamSlug}/games/{gameId}/scoreboard`
- `GET /api/teams/{teamSlug}/games/{gameId}/participants`
- `GET /api/teams/{teamSlug}/games/{gameId}/batting-lines`
- `GET /api/teams/{teamSlug}/games/{gameId}/pitching-lines`
- `GET /api/teams/{teamSlug}/players`
- `GET /api/teams/{teamSlug}/players/{playerId}`
- `GET /api/teams/{teamSlug}/stats/batting`
- `GET /api/teams/{teamSlug}/stats/pitching`
- `GET /api/teams/{teamSlug}/rankings`
- `GET /api/teams/{teamSlug}/tournaments`
- `GET /api/teams/{teamSlug}/tournaments/{tournamentId}`
- `GET /api/stadiums`
- `GET /api/stadiums/{stadiumId}`

運用・仕様確認用のエンドポイントとして、次も実装している。

- `GET /api/health`
- `GET /api/swagger-ui/index.html`
- `GET /api/v3/api-docs`

## 3. 公開API詳細

### 3-1. チーム情報

#### `GET /api/teams/{teamSlug}`

- 概要: チームの基本情報を返す
- 例:

以下のJSONは構造を示す例であり、ID・年度・試合内容はseedの現在値を保証するものではない。

```json
{
  "id": 1,
  "slug": "cats",
  "name": "新琴似CATS",
  "shortName": "CATS",
  "area": "札幌市",
  "foundedYear": 2006,
  "isActive": true
}
```

#### `GET /api/teams/{teamSlug}/summary`

- 概要: トップページ向けにチーム情報、シーズン、成績サマリー、最近の試合、今後の試合をまとめて返す
- 例:

```json
{
  "team": { "id": 1, "slug": "cats", "name": "新琴似CATS" },
  "season": { "year": 2026, "current": true },
  "record": { "games": 18, "wins": 11, "losses": 6, "draws": 1 },
  "recentGames": [
    { "gameId": 101, "gameDate": "2026-06-29", "opponentName": "○○クラブ", "result": "win" }
  ],
  "upcomingGames": []
}
```

- 補足
  - `seasonYear` は省略時に現在シーズン、無ければ最新シーズンを使う
  - `recentLimit` / `upcomingLimit` は既定 5、範囲外は `INVALID_QUERY_PARAMETER`
  - `recentLimit` / `upcomingLimit` は1以上20以下で、nullの場合は5として扱う

### 3-2. シーズン一覧

#### `GET /api/teams/{teamSlug}/seasons`

- 概要: 年度一覧を返す
- 例:

```json
[
  { "id": 12, "year": 2026, "name": "2026シーズン", "isCurrent": true }
]
```

### 3-3. 試合一覧・詳細

#### `GET /api/teams/{teamSlug}/games`

- 概要: 試合予定・結果一覧を返す
- `seasonYear` と `status` を任意で指定できる。`status` 未指定時は全状態を返し、指定時だけ
  DBの `scheduled` / `completed` / `cancelled` / `postponed` などの値で絞り込む
- `status` は `scheduled` / `completed` / `cancelled` / `postponed` のいずれかとして検証し、未知の値は
  他の成績・ランキングAPIと同じく 400 `INVALID_QUERY_PARAMETER` を返す
- 例:

```json
[
  {
    "gameId": 101,
    "seasonYear": 2026,
    "gameDate": "2026-06-29",
    "opponentName": "○○クラブ",
    "status": "completed",
    "result": "win"
  }
]
```

#### `GET /api/teams/{teamSlug}/games/{gameId}`

- 概要: 試合の基本情報を返す
- 例:

```json
{
  "gameId": 101,
  "gameDate": "2026-06-29",
  "opponentName": "○○クラブ",
  "status": "completed",
  "result": "win"
}
```

#### `GET /api/teams/{teamSlug}/games/{gameId}/scoreboard`

- 概要: 試合のチーム別イニング得点と合計得点・安打・失策を返す
- `status` は `unregistered` / `draft` / `complete` のいずれか
- 内部実装ではstatusをenumで管理するが、JSON値は上記の小文字表現を返す
- `innings` は登録済みのイニングだけを含み、未登録イニングは配列に含めない
- `innings[].status` は `played` / `not_batted` のいずれかで、`not_batted` の場合は `runs` が `null`
- Java内部では試合単位・イニング単位のstatusをenumで管理し、JSONではDB/APIの小文字値へ変換する
- `opponent` が `true` の場合は対戦相手の行を表し、対戦相手の `teamId` は `null` とする
- 例:

```json
{
  "status": "complete",
  "rows": [
    {
      "scoreLineId": 1,
      "teamId": 1,
      "teamName": "新琴似CATS",
      "opponent": false,
      "innings": [
        { "inningNumber": 1, "runs": 0, "status": "played" },
        { "inningNumber": 2, "runs": 1, "status": "played" },
        { "inningNumber": 7, "runs": null, "status": "not_batted" }
      ],
      "runs": 3,
      "hits": 5,
      "errors": 1
    },
    {
      "scoreLineId": 2,
      "teamId": null,
      "teamName": "札幌ベアーズ",
      "opponent": true,
      "innings": [
        { "inningNumber": 1, "runs": 0, "status": "played" }
      ],
      "runs": 1,
      "hits": 4,
      "errors": 0
    }
  ]
}
```

#### `GET /api/teams/{teamSlug}/games/{gameId}/participants`

- 概要: 試合参加者一覧を返す
- 例:

```json
[
  { "gameParticipantId": 1, "playerId": 1, "displayName": "山田 太郎", "guest": false },
  { "gameParticipantId": 10, "playerId": null, "displayName": "助っ人A", "guest": true }
]
```

#### `GET /api/teams/{teamSlug}/games/{gameId}/batting-lines`

- 概要: 試合ごとの選手別打撃成績を返す
- 例:

```json
[
  { "battingLineId": 1, "playerId": 1, "displayName": "山田 太郎", "hits": 2, "runsBattedIn": 1 }
]
```

#### `GET /api/teams/{teamSlug}/games/{gameId}/pitching-lines`

- 概要: 試合ごとの投手成績を返す
- 例:

```json
[
  { "pitchingLineId": 1, "playerId": 3, "displayName": "佐藤 一郎", "outsPitched": 15, "earnedRuns": 1 }
]
```

- 補足
  - 参加者、打撃、投球はいずれも助っ人を `playerId = null` で扱う
  - MVP では打席単位は扱わない。イニングスコアは scoreboard API で扱う

### 3-4. 選手

#### `GET /api/teams/{teamSlug}/players`

- 概要: 選手一覧を返す
- 例:

```json
[
  { "playerId": 11, "name": "山田太郎", "uniformNumber": "18", "primaryPosition": "投手" }
]
```

#### `GET /api/teams/{teamSlug}/players/{playerId}`

- 概要: 選手詳細を返す
- 例:

```json
{
  "playerId": 11,
  "name": "山田太郎",
  "uniformNumber": "18",
  "primaryPosition": "投手",
  "description": "エース兼主砲"
}
```

### 3-5. 成績

#### `GET /api/teams/{teamSlug}/stats/batting`

- 概要: 打撃成績一覧を返す
- 例:

```json
[
  { "playerId": 11, "displayName": "山田 太郎", "games": 12, "battingAverage": "0.364", "ops": "0.966" }
]
```

- 補足
  - `seasonYear`、`tournamentId`、`status`、`includeGuests`、`sort` を任意で指定できる
  - 既定値は `status=completed`、`includeGuests=false`、`sort=battingAverage`
  - `seasonYear` を省略した場合は全シーズンの通算成績を返す
  - `status` と `sort` の無効値は 400 `INVALID_QUERY_PARAMETER`
  - 率系は 3 桁固定文字列で返す

#### `GET /api/teams/{teamSlug}/stats/pitching`

- 概要: 投手成績一覧を返す
- 例:

```json
[
  { "playerId": 11, "displayName": "山田太郎", "games": 8, "outsPitched": 42, "earnedRunAverage": "2.188" }
]
```

- 補足
  - `seasonYear`、`tournamentId`、`status`、`includeGuests`、`sort` を任意で指定できる
  - 既定値は `status=completed`、`includeGuests=false`、`sort=earnedRunAverage`
  - `seasonYear` を省略した場合は全シーズンの通算成績を返す
  - `status` と `sort` の無効値は 400 `INVALID_QUERY_PARAMETER`
  - `earnedRunAverage = earnedRuns * 21 / outsPitched`
  - `outsPitched = 0` の場合は `"0.000"`
  - `sort=earnedRunAverage` は低い順、`outsPitched = 0` は最後

#### `GET /api/teams/{teamSlug}/rankings`

- 概要: 主要指標の上位一覧を返す
- 例:

```json
{
  "batting": [
    { "category": "battingAverage", "leaders": [{ "rank": 1, "playerId": 11, "value": "0.364" }] }
  ],
  "pitching": [
    { "category": "earnedRunAverage", "leaders": [{ "rank": 1, "playerId": 12, "value": "1.750" }] }
  ],
  "requiredPlateAppearances": 27,
  "requiredInningsPitchedOuts": 27,
  "requiredInningsPitchedText": "9回"
}
```

- 補足
  - `category` 未指定時は主要カテゴリをまとめて返す
  - 既定値は `status=completed`、`includeGuests=false`、`qualifiedOnly=true`、`limit=5`
  - `requiredPlateAppearances` と `requiredInningsPitchedOuts` は、対象試合数をもとにAPI側で算出した規定値
  - 規定打席は `ceil(対象試合数 × 1.5)`、規定投球回は `ceil(対象試合数 × 0.5回 × 3アウト)` で算出する
  - 係数はAPI側の `RankingService` に定数として集約する
  - `requiredInningsPitchedText` は `requiredInningsPitchedOuts` を表示用に変換した値
  - `qualifiedOnly=true` の場合、規定打席または規定投球回の到達者のみを対象にする
  - 順位付けは competition ranking 方式とする
  - `limit` はカテゴリごとの上位件数として扱い、nullの場合は5、指定時は1以上20以下とする
  - 不正な `category` / `limit` は 400 `INVALID_QUERY_PARAMETER`

### 3-6. 大会・球場

#### `GET /api/teams/{teamSlug}/tournaments`

- 概要: 大会一覧を返す
- 例:

```json
[
  { "tournamentId": 301, "name": "2026年春季大会", "seasonYear": 2026, "displayOrder": 1 }
]
```

#### `GET /api/teams/{teamSlug}/tournaments/{tournamentId}`

- 概要: 大会詳細を返す

#### `GET /api/stadiums`

- 概要: 球場一覧を返す
- 例:

```json
[
  { "stadiumId": 401, "name": "モエレ沼公園野球場", "address": "札幌市東区" }
]
```

#### `GET /api/stadiums/{stadiumId}`

- 概要: 指定した球場の詳細を返す

## 4. レスポンス設計方針

- APIレスポンスは camelCase にする
- DB行をそのまま返さず、公開画面に必要なDTOを返す
- 日付は ISO 8601 形式で返す
- 率系は原則 3 桁固定の文字列で返す
- `outsPitched` は内部の投球アウト数で返し、表示用に `inningsPitchedText` も返す
- 一覧系は表示に必要な基本項目、詳細系は親リソースと関連情報、集計系は順位・率・件数を返す

## 5. エラー設計

### 5-1. 基本方針

- 存在しない `teamSlug` は 404
- 存在しない `gameId` は 404
- `teamSlug` と `gameId` が一致しない場合も 404
- 成績・ランキング・サマリーで実装している範囲外のクエリパラメータは 400
- 試合一覧・成績・ランキングの `status` は列挙値として検証し、不正値は 400 `INVALID_QUERY_PARAMETER` を返す
- MVP では認証エラー 401/403 は基本扱わない

### 5-2. エラーレスポンス形式

```json
{
  "error": {
    "code": "TEAM_NOT_FOUND",
    "message": "チームが見つかりません。",
    "details": []
  }
}
```

### 5-3. エラーコード例

- `TEAM_NOT_FOUND`
- `SEASON_NOT_FOUND`
- `GAME_NOT_FOUND`
- `PLAYER_NOT_FOUND`
- `STADIUM_NOT_FOUND`
- `TOURNAMENT_NOT_FOUND`
- `INVALID_QUERY_PARAMETER`

### 5-4. 補足

- 画面表示の都合で、API は短いエラーコードを返し、フロントでメッセージを整える
- 404 は「見つからない」ことを明確に表すために使う

### 5-5. 実装方針

例外クラスの配置・実装方針は、この文書の共通例外方針と現在のAPI実装を正とする。

## 6. ページング・ソート方針

- MVPでは件数が少ないAPIは全件返却でもよい
- 将来件数が増える一覧APIでは `page` / `size` を追加できるようにする
- `sort` / `order` は画面で必要なAPIから順に対応する
- 不正なページング・ソート条件は 400 `INVALID_QUERY_PARAMETER` を返す

## 7. 集計計算方針

- `battingAverage`, `onBasePercentage`, `sluggingPercentage`, `ops` は API 側で計算する
- `earnedRunAverage = earnedRuns * 21 / outsPitched`
- `walksAndHitsPerInningPitched = (walks + hitsAllowed) * 3 / outsPitched`
- `strikeoutsPerSevenInnings = strikeouts * 21 / outsPitched`
- MVP では率系の分母が 0 の場合、API 表現は `"0.000"` とする
- ソート時は分母 0 の選手を最後に並べる
- 表示側では必要に応じて `"-"` に変換する

## 8. 入力APIと将来の拡張

- MVPでは公開読み取りAPIだけを実装する
- 管理・入力APIは現時点で存在せず、将来検討時の候補として `/api/me/...` を優先候補にする
- 入力APIの詳細は [入力API設計](input-api-design.md) を参照する

## 9. 参照ドキュメント

- [画面・サイト方針](new-site-plan.md)
- [ドメインモデル](domain-model.md)
- [DB設計](database-design.md)
- [入力API設計](input-api-design.md)
- [実装ロードマップ](implementation-roadmap.md)
