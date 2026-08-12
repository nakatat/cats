# テスト戦略

対象: 新琴似CATS 非公式公開サイト MVP のテスト戦略
MVP では公開 API の信頼性を優先し、成功レスポンスと代表的なエラーレスポンスを重点的に確認する。Frontendは、pure function、Component、実ブラウザ上の画面統合をテスト責務として分離する。現時点の実装は公開読み取り機能のみを対象とし、管理画面・認証・入力APIのテストは存在しない。

## 1. テスト方針の概要

- 公開 API の成功系・代表的な失敗系を優先する
- 管理画面、認証、権限管理は MVP 外なので対象外とする
- 旧サイトのHistorical資料（`docs/old-site-analysis.md`）はテスト対象外とする
- Controller / Handler / Service の軽量テストを中心に実装している
- SQL や成績集計が複雑になったら Mapper / Integration Test を厚くする
- Frontendの非自明な契約は日本語TSDoc、Backendの非自明なドメイン仕様は日本語Javadocで補足する

## 2. テスト種類

| 種類 | 主な対象 | 方針 |
|---|---|---|
| Frontend Unit Test | pure function, presenter, calculations | VitestをNode環境で実行し、入力と出力を確認する |
| Frontend Component Test | React Componentの表示・操作 | Storybook storyをfixtureとしてVitest Browser Modeで確認する |
| Frontend E2E Test | Next.js + APIのrouting, URL, browser history, responsive | PlaywrightのChromiumで実際の画面統合を確認する |
| Unit Test | Service, 計算ロジック, DTO 変換 | DB に依存しない処理を確認する |
| Web/API Test | Controller, ApiExceptionHandler | `@WebMvcTest` を基本に HTTP 応答を確認する |
| Mapper Test | MyBatis Mapper, SQL | SQL が複雑になった段階で強化する |
| Integration Test | Controller -> DB | 主要 API に限定し、必要に応じて Testcontainers を使う |

## 3. 現在のテスト実装

- Frontendの `src/**/*.test.ts` には、formatter、ゲーム一覧計算・query、選手表示計算、
  成績presenterのVitest unit testがある
- Storybook storyをfixtureとして、`@storybook/addon-vitest` と Playwright Chromiumによる
  Component Testを実行する
- `apps/web/e2e` には、ゲーム、選手、成績、navigation、responsiveのPlaywright E2Eがある
- BackendはJUnitでController、Service、共通例外、query、統計計算などをfeature単位に確認する
- 現在、MyBatis Mapperを直接実DBで確認するIntegration TestやTestcontainersは導入していない
- Frontendは `apps/web/README.md` の `test`、`test:storybook`、`test:e2e` を責務ごとに実行する

## 4. 現時点で実装済みの主な確認範囲

### 4-1. 基本導線

- Team
- Team Summary
- Player
- Game
- Stadium

確認観点:

- 200 が返る
- 主要フィールドが返る
- 存在しないリソースで 404 が返る
- エラーレスポンス形式が共通である

### 4-2. 試合詳細導線

- Game Participant
- Batting Line
- Pitching Line

確認観点:

- 参加者・打撃成績・投球成績が返る
- 通常選手と助っ人を区別できる
- 存在しない試合で 404 が返る

### 4-3. 成績・ランキング導線

- Batting Stats
- Pitching Stats
- Rankings

確認観点:

- 集計値・率系文字列が返る
- 成績・ランキングAPIの `status` / `sort` / `limit` / `category` などの代表的なクエリを確認する
- 不正なクエリで 400 `INVALID_QUERY_PARAMETER` が返る

### 4-4. エラーハンドリング

- `NotFoundException` 系例外が共通形式の 404 になる
- 不正クエリが共通形式の 400 になる
- 予期しない例外が 500 になる

詳細な API 仕様は [API設計](api-design.md) を参照する。

## 5. テストデータ方針

- Controller テストは mock を使い、seed data に依存しない
- Mapper / Integration Test は必要になったら Testcontainers を検討する
- seed data は画面確認・簡易確認用として扱う
- migration squash 後は DB を作り直して確認する

## 6. テスト配置方針

- 本体と同じ feature ベースで配置する
- 共通のテスト補助は `support` に置く

## 7. CIでの現在の実行内容

- Backend CIの `test` jobでは、`mvn spotless:check` と `mvn test` を実行する。`main` への
  pushで成功した場合は、同じworkflowのdeploy jobがRender deploy hookを呼び出す
- Frontend CIでは次のJobを分離して実行する。
  - `frontend-quality`: format check、lint、typecheck、Vitest unit test。PRまたはmain以外の
    pushではNext.js buildも実行する
  - `frontend-component`: Storybook + Vitest Browser Mode、Storybook build
  - `frontend-e2e`: fresh PostgreSQL、Flyway migration、実Backend API、Next.js、Playwright Chromium
- Frontend CIのE2Eは本番サービスへ接続せず、GitHub Actionsのservice container内で完結する
- Frontend CIの全Jobが `main` で成功した場合、deploy jobがVercel CLIでproductionへdeployする
- pnpmの依存キャッシュはworkflow内のactions/cacheで管理し、setup-nodeのpackage-manager-cacheは使用しない
- Testcontainers 導入時は CI の Docker 実行環境を考慮する
- 詳細な実行方法は [Javaコーディング規約](java-coding-style.md) を参照する

## 8. 現時点で対象外のテスト

- カバレッジ管理: `JaCoCo`, 厳密なカバレッジ目標
- Visual Regression、screenshot比較、厳密なレスポンシブ画素検証
- Firefox / WebKitを含むクロスブラウザ展開
- 負荷 / セキュリティテスト
- 管理画面・認証・権限のテスト
- 全 API・全 Mapper の網羅テスト

## 9. 参照ドキュメント

- [API設計](api-design.md)
- [DB設計](database-design.md)
- [実装ロードマップ](implementation-roadmap.md)
- [Javaコーディング規約](java-coding-style.md)
