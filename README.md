# 新琴似CATS リニューアル

新琴似CATSの旧Webサイトを分析し、公開サイトと公開読み取りAPIとして再設計・再構築したプロジェクトです。過去の試合結果、選手情報、打撃・投手成績を、スマートフォンでも閲覧しやすい形で提供します。

管理画面や認証・入力機能を含む業務システムではなく、まずはチームの活動を伝える公開体験と、画面を支える読み取りAPIにスコープを絞っています。

## 公開環境

- Web: [https://cats-ochre.vercel.app](https://cats-ochre.vercel.app)（Vercel）
- API: [https://cats-c0l7.onrender.com](https://cats-c0l7.onrender.com)（Render）
- API health: [https://cats-c0l7.onrender.com/api/health](https://cats-c0l7.onrender.com/api/health)
- Swagger UI: [https://cats-c0l7.onrender.com/api/swagger-ui/index.html](https://cats-c0l7.onrender.com/api/swagger-ui/index.html)
- OpenAPI JSON: [https://cats-c0l7.onrender.com/api/v3/api-docs](https://cats-c0l7.onrender.com/api/v3/api-docs)
- Database: PostgreSQL（Neon）

WebはVercel上のNext.jsからRenderのAPIを参照し、APIはNeon PostgreSQLへ接続します。公開環境はポートフォリオと動作確認を目的としており、Webページには検索エンジン向けの`noindex`を設定しています。

## 主な機能

- トップページでチーム情報、直近・今後の試合、成績概要を表示
- 試合一覧の年度・大会・結果などによる絞り込み
- 試合詳細でのスコアボード、イニングスコア、出場情報、打撃・投手成績の表示
- 選手一覧・選手詳細・直近の出場情報の表示
- 打撃成績、投手成績、ランキングの表示
- 上記の画面を支える認証なしの公開`GET` API

現在の公開Web routeは `/`、`/games`、`/games/[gameId]`、`/players`、`/players/[playerId]`、`/stats` です。管理画面、認証、権限管理、試合・成績の入力APIは現在の実装には含めていません。

## 技術スタック

| 領域 | 技術 |
| --- | --- |
| Frontend | Next.js 16（App Router）、TypeScript、Tailwind CSS v4、shadcn/ui、Server Components |
| Backend | Spring Boot 3.5.16、Java 21、MyBatis、Flyway 13、Springdoc OpenAPI |
| Database | PostgreSQL（本番: Neon、ローカル/CI: PostgreSQLコンテナ） |
| Infrastructure | Docker Compose、Dev Containers、Vercel、Render、GitHub Actions |
| Testing | Vitest、Storybook + Vitest Browser Mode、Playwright Chromium、JUnit |

FrontendはNode.js 22とpnpm 10.15.0を前提にしています。APIのOpenAPI定義からFrontendのTypeScript型を生成する構成です。

## アーキテクチャ

```text
Browser
  ↓
Vercel / Next.js（apps/web）
  ↓ server-side fetch
Render / Spring Boot REST API（apps/api）
  ↓
Neon / PostgreSQL
```

リポジトリはWebとAPIを個別に管理する構成です。ルートのpackage workspaceやTurborepoは使用していません。

DBスキーマと公開確認用seedは`apps/api/src/main/resources/db/migration`でFlyway管理し、API起動時に適用します。ローカルとCIではPostgreSQLコンテナ、本番ではNeon PostgreSQLを使用します。

```text
apps/
├── web/       # Next.js公開フロントエンド
└── api/       # Spring Boot公開読み取りAPI
docs/          # 設計・テスト・旧サイト調査
compose.yaml   # ローカルPostgreSQLとDev Container
.github/
└── workflows/ # Frontend/APIのCI/CD
```

## 設計上のポイント

- `teams`をドメインの起点とし、APIは`/api/teams/{teamSlug}/...`を基本にして、将来の複数チーム対応に拡張しやすくしています。
- 試合時点の表示名・背番号・ポジションは`game_participants`にスナップショットとして保持し、助っ人を恒久的な`players`として登録しなくても出場記録を表現できます。
- 試合のチーム別得点とイニングごとの状態を分けて保持し、scoreboardとして画面へ返します。
- DB行を直接公開せず、API側で画面向けDTO・率・集計値へ変換します。FrontendはOpenAPIから生成した型とAPI通信wrapperを利用します。
- Next.jsのServer ComponentsからAPIを取得し、通信wrapperでtimeout・一時的な失敗へのretry・revalidationを共通化しています。

## 旧サイトからの再構築

旧サイトをそのまま移行するのではなく、次の順に公開サイトとして再構築しました。

1. 旧サイトの画面・データ・運用上の責務を調査
2. 公開サイト向けにドメイン、DB、APIの責務を再設計
3. Next.jsとSpring BootでFrontend/APIを分離して実装
4. unit / component / E2E test、CI/CD、Production deploymentまで整備

旧サイトの調査内容は、現行実装とは分離したHistorical資料として[旧サイト調査](docs/old-site-analysis.md)にまとめています。

## Testing / CI/CD

Frontendは責務を分けて次のテストを実装しています。

- Vitest: formatter、query、calculations、presenterなどのunit test
- Storybook + Vitest Browser Mode: 共有Componentの表示・操作テスト
- Playwright Chromium: Next.jsとAPIを接続したrouting、URL、browser history、responsive UIのE2E

BackendはJUnitでController、Service、共通例外、query、成績計算などをfeature単位で確認しています。API CIではSpotlessによるJava formatting checkとMaven testを実行します。

GitHub ActionsではFrontendのquality / component / E2Eを分離しています。E2EはCI専用のPostgreSQL service containerにFlyway migrationを適用し、実Backend APIとNext.jsを起動して確認します。`main`へのpushでCIが成功すると、APIはRender、WebはVercelのproductionへdeployします。

## ローカル開発

### 前提

- Docker / Docker Compose
- VS Code Dev Containers（推奨）
- Dev Containerを使わない場合はNode.js 22、pnpm 10.15.0、Java 21、Maven

### 起動

1. VS Codeで`Dev Containers: Reopen in Container`を実行する
2. `apps/web/.env.example`と`apps/api/.env.example`を参考に環境変数を設定する
3. Dev Containerの自動起動を使わない場合は、PostgreSQLを起動してからAPIとWebを起動する

```bash
docker compose up -d postgres
mvn -f apps/api/pom.xml spring-boot:run
pnpm --dir apps/web dev
```

主なローカルURLは、Webが`http://localhost:3000`、APIが`http://localhost:8081/api`、Swagger UIが`http://localhost:8081/api/swagger-ui/index.html`、Storybookが`http://localhost:6006`です。詳細なテスト・フォーマット・環境変数は[Frontend README](apps/web/README.md)と[API README](apps/api/README.md)を参照してください。

## Documentation

- [サイト方針・公開ページ構成](docs/new-site-plan.md)
- [ドメインモデル](docs/domain-model.md)
- [DB設計](docs/database-design.md)
- [公開API設計](docs/api-design.md)
- [テスト戦略](docs/test-strategy.md)
- [Java / Node.js のセキュリティ更新](docs/runtime-security-updates.md)
- [実装ロードマップ](docs/implementation-roadmap.md)
- [旧サイト調査（Historical）](docs/old-site-analysis.md)
