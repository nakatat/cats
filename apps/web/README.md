# cats-web

新琴似CATS の公開フロントエンドです。
Next.js + TypeScript + Tailwind CSS + shadcn/ui を使用します。
Node.js は 22 LTS を前提にしています。
package manager は pnpm です。

公開URL: <https://cats-ochre.vercel.app>

## 前提

- Dev Container 内で API を起動しておく
- 既定の API base URL は `http://localhost:8081/api`

## 環境変数

`apps/web/.env.example` を参考に、`apps/web/.env.local` を作成してください。

- `API_BASE_URL`
- `DEFAULT_TEAM_SLUG`
- `NEXT_PUBLIC_SITE_URL`

## 起動コマンド

```bash
pnpm install
pnpm dev
```

Dev Container 内で次を実行します。

```bash
pnpm --dir apps/web dev
```

`apps/web/node_modules` と `.next` は workspace コンテナの named volume で管理します。

## 想定 URL

- Top: `http://localhost:3000`
- Production: `https://cats-ochre.vercel.app`

本番ではVercel上のServer Componentsから、`API_BASE_URL`で指定したRender APIを取得します。
API取得に失敗した場合は、画面全体ではなく該当セクションにエラー表示を出します。

## 現在の主な機能

- `GET /api/teams/{teamSlug}/summary` を server-side fetch で取得する
- `ApiResult` を frontend 側で扱う
- トップページでチーム情報、成績、最近の試合を表示する
- トップページは Deep Green の Hero とスコアボード風の成績表示を中心に、草野球チームの公開サイトらしい硬派な見た目に寄せる

## Lint / Format

flat config を使って ESLint と Prettier を分けて管理します。

```bash
pnpm run lint
pnpm run format
pnpm run format:check
pnpm run typecheck
pnpm run build
pnpm run generate:api
pnpm run storybook
pnpm run build-storybook
pnpm run test
pnpm run test:storybook
pnpm run test:e2e
pnpm run test:e2e:ui
```

コミット時は Husky と lint-staged が staged ファイルを対象に Prettier、ESLint の自動修正と TypeScript の型チェックを実行します。いずれかが失敗するとコミットは中断されます。
`apps/web` の `pnpm install` に含まれる `prepare` で hook が有効になります。API の Java ファイルをコミットする場合は、同じ hook で Spotless の `spotless:apply` も実行します。

## テスト

- `pnpm test`: Vitest による pure function、presenter、calculations の unit test
- `pnpm test:storybook`: Storybook + Vitest Browser Mode による Component Test
- `pnpm test:e2e`: Playwright Chromium による routing、URL query、browser history、responsive UI のE2E

`pnpm test:e2e` は Playwright の `webServer` 設定でAPIとNext.jsを起動または再利用します。APIが使用するPostgreSQLを先に起動してください。

```bash
docker compose up -d postgres
pnpm test:e2e
```

標準の接続先は、Webが `http://localhost:3000`、APIが `http://localhost:8081/api` です。別のポートやDBを使う場合は、`E2E_BASE_URL`、`E2E_API_BASE_URL`、`E2E_API_PORT`、`E2E_DATABASE_URL` でPlaywrightの起動先を上書きできます。

GitHub Actionsでは、Frontendのformat check・lint・typecheck・unit test・Next.js build、Storybook Component Test・Storybook build、Playwright E2Eを別Jobで実行します。E2EはCI専用のPostgreSQL service containerへFlyway migrationを適用し、実Backend APIとNext.jsを起動して確認します。

## Storybook

`apps/web` では Storybook を共有コンポーネントの確認導線として使います。

- 起動: `pnpm storybook`
- ビルド: `pnpm build-storybook`
- URL: `http://localhost:6006`
- `TeamHero`、`TeamRecordCard`、`RecentGamesSection`、`UpcomingGamesSection`、`NavigationCards`、`SiteHeader` の stories を用意しています

## 今後追加するもの

- `shadcn/ui` のコンポーネント拡充
