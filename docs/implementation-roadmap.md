# 実装ロードマップ

対象: 新琴似CATS 非公式公開サイト MVP

この文書は、現在の実装状況と今後の候補を管理する。個別の仕様は、
[画面・サイト方針](new-site-plan.md)、[DB設計](database-design.md)、
[API設計](api-design.md) などの各正ドキュメントを参照する。

## 1. 現在の実装状況（A: 実装済み）

### リポジトリと実行基盤

- `apps/web` と `apps/api` を同一リポジトリで管理する
- ルートの `package.json`、`pnpm-workspace.yaml`、Turborepo設定はなく、Webは
  `apps/web/package.json`、APIは `apps/api/pom.xml` を起点に個別管理する
- Webは Next.js App Router / TypeScript / Tailwind CSS v4 / shadcn/ui、Node.js 22 / pnpm 10.15.0
- APIは Spring Boot 3.5.16 / Java 21 / MyBatis / Flyway 13 / Springdoc OpenAPI

### Backendと公開API

- feature単位のController / Service / Mapper / DTO構成を実装している
- 共通NotFound、Bad Request、予期しない例外のレスポンス処理を実装している
- 業務APIは認証なしの公開読み取り用 `GET` のみで、入力用のPOST/PATCH/PUT/DELETEはない
- チーム、シーズン、サマリー、大会、球場
- 試合一覧・詳細、参加者、打撃ライン、投球ライン、スコアボード
- 選手一覧・詳細、打撃成績、投手成績、ランキング
- OpenAPI JSONを `apps/web/src/types/api.generated.ts` に生成するスクリプトを持つ

エンドポイント、クエリ、レスポンス、enum、エラーは [API設計](api-design.md) を正とする。

### DB

- PostgreSQLを使用し、本番DBはNeon、ローカルとCIはPostgreSQLコンテナを使用する
- `V1__create_initial_schema.sql` にスキーマと公開確認用seedをsquashしている
- `V2__restore_public_search_path.sql` は、V1適用済み環境でアプリの未修飾SQLが `public` schemaを
  使用できるようにする補正migrationである
- `teams`、`seasons`、`players`、`tournaments`、`stadiums`、`games`、
  `game_participants`、`batting_lines`、`pitching_lines`、`game_score_lines`、
  `game_inning_scores` を実装している

### Web

- `/`、`/games`、`/games/[gameId]`、`/players`、`/players/[playerId]`、`/stats` を実装している
- `/stats` は打撃成績、投手成績、ランキングをまとめて表示する
- 試合詳細では参加者情報を含む打撃・投手成績、イニングスコアを表示する
- 共通UIのStorybook stories、Vitest unit test、Storybook + Vitest Browser ModeのComponent Test、
  Playwright ChromiumのE2Eを実装している

### HostingとCI/CD

- WebはVercel、APIはRender、DBはNeonで運用する
- APIは `.github/workflows/api-ci.yml` のSpotless check / Maven test 成功後、`main` pushでRender
  deploy hookを呼び出す
- Frontendは `.github/workflows/frontend-ci.yml` でquality / component / E2Eを分離し、`main` pushで
  全Jobが成功した場合にVercel CLIからproduction deployする
- `apps/web/vercel.json` はGit連携による自動デプロイを無効にし、GitHub Actions経由のdeployを使う

## 2. 仕様の分類

### A. 現在実装済み

- 公開Webの6 route（トップ、試合2画面、選手2画面、成績）
- 公開読み取りAPIとOpenAPI生成型
- PostgreSQL / Flywayの現行スキーマ、seed、スコアボード
- Web unit / Component / E2E、Backend JUnit、Frontend CI / Backend CI
- Vercel / Render / Neonのデプロイ構成

### B. 現在仕様だが未実装

リポジトリ上で現在仕様として確定しているBの機能はない。入力・認証・管理機能は、実装予定と
断定せずCの将来候補として扱う。

### C. 将来構想

- `/team`、`/rankings`、`/tournaments`、`/seasons/[year]`、独立した打撃・投手成績画面
- 管理画面、認証・認可、試合予定・結果、参加者、打撃・投手成績、イニングスコアの入力
- 複数チーム管理、招待、課金、SaaS化、LINE・メールなどの外部サービス連携
- 打席単位、守備詳細、イベント履歴、写真・表彰・ギャラリー
- 専用OGP画像、独自ドメインなどの公開運用強化

詳細な入力API候補は [入力API設計](input-api-design.md) に分離している。

### D. 廃止された旧仕様

- 旧サイトで使っていた Spring Boot 2.7 / Java 17 / Thymeleaf / DBFlute / MySQLと、
  同サイトの管理画面・ログイン・入力機能
- 旧サイトの実体はTASK-01.5で削除済み。旧仕様は比較・調査用のHistorical情報であり、
  新しい `apps/web` / `apps/api` の現行仕様ではない

## 3. これから実装を検討するもの

### 公開サイトの拡張

- 独立画面を追加する場合は、既存の `/stats` や一覧画面との役割分担を先に確定する
- 公開コンテンツ、画像、OGP、独自ドメインなどの運用強化を検討する

### 管理・入力機能

- 管理画面、認証・認可、試合・成績入力は、公開読み取りAPIとは別の機能群として検討する
- 実装する場合のAPI候補は [入力API設計](input-api-design.md) を起点に再評価する

## 4. 実装時の優先順位

1. 既存の公開API・生成型・Web画面の契約を維持する
2. 現在の公開画面に不足するコンテンツや独立画面の要否を整理する
3. 実装済みのunit / Component / E2E testとCI/CDを機能追加に合わせて維持する
4. 入力APIと管理画面は、認証・認可を含む別設計として合意後に検討する

## 5. 未確定事項と設計上の注意

- 独立したランキング、大会、シーズン、成績画面を追加する時期は未決定
- 入力APIのチーム識別子を `{teamId}` と `{teamSlug}` のどちらにするかは未決定
- 手書きのAPI設計書と生成OpenAPIの自動同期は未導入。生成型はAPI起動時に生成するものではなく、
  `apps/web/package.json` の `generate:api` で明示的に更新する
- 旧サイトの実体は削除済み。旧サイトの調査記録は [旧サイト調査](old-site-analysis.md) に残し、
  新アプリの実装状況と混同しない

## 6. 参照ドキュメント

- [画面・サイト方針](new-site-plan.md)
- [ドメインモデル](domain-model.md)
- [DB設計](database-design.md)
- [API設計](api-design.md)
- [入力API設計](input-api-design.md)
- [テスト方針](test-strategy.md)
- [旧サイト調査](old-site-analysis.md)
