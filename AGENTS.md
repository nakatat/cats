# AGENTS.md

このファイルは、AI coding agentがこのリポジトリで作業する際に守る基本ルールを定義します。
詳細な設計・仕様・テスト方針は、必要な作業に対応する `docs/` を参照してください。

## リポジトリと技術構成

- `apps/api`: Spring Boot 3.x / Java 21 / MyBatis / Flyway の公開読み取りAPI
- `apps/web`: Next.js App Router / TypeScript / Tailwind CSS v4 / shadcn/ui の公開フロントエンド
- `docs`: 設計・実装方針・テスト方針

ドキュメント、説明、設計方針は日本語で書き、コード、クラス名、テーブル名、APIパス、ファイル名は英語で書きます。

## プロジェクトの不変条件

- 旧サイトの直接移行ではなく、新しい公開サイトと公開APIとして設計する
- MVPは新琴似CATS 1チームの公開読み取りを対象とし、管理画面、認証、権限管理、複数チーム運用画面、SaaS化、お問い合わせフォームは対象外とする
- 将来の複数チーム対応を見据え、`teams` を設計の起点にする
- 公開サイトとしての閲覧体験を優先し、管理画面風のUIにしない
- 設計判断を変更した場合は、対応する設計ドキュメントも更新する
- 既存APIのレスポンス形式を、依頼なしに変更しない

## 命名とAPIの境界

- DBテーブルは英語の複数形、DBカラムは `snake_case` にする
- ドメインモデル、Java / TypeScript の型・DTOは英語の単数形または用途が分かる名前にする
- APIレスポンスは `camelCase` にする
- 外部公開URLは `/api/...` とし、Controllerのmappingには `/api` を書かない
- `/api` は `spring.mvc.servlet.path=/api` で付与し、`server.servlet.context-path=/api` は使わない
- `/api/public` は使わず、公開APIは `/api/teams/{teamSlug}/...` を基本にする
- `stadiums` は `/api/stadiums` 配下で公開する
- DB行を直接返さず、画面向けDTOへ変換する。率や集計値はAPI層で計算する
- APIテストでは外部URLに `/api/...` を使い、MockMvcには `.servletPath("/api")` を付ける

## Backend実装ルール

- 新しいfeatureは `dev.baseballscore.cats.api.<feature>` 配下に置く
- feature固有のController、Service、DTO、Mapper、Mapper rowはfeature package内に置く
- MyBatis XMLは `apps/api/src/main/resources/mapper`、Flyway migrationは `apps/api/src/main/resources/db/migration` に置く
- Controllerに業務ロジックを書かず、ServiceからDB rowを直接返さない
- 共通例外は `common/exception`、feature固有のNotFoundExceptionはfeature packageに置く
- feature固有のNotFoundExceptionは共通 `NotFoundException` を継承し、`ApiExceptionHandler` の共通処理で扱う
- error codeは安定した機械判定可能な値、response messageはクライアント表示可能な日本語にする
- 想定内のNotFoundはwarn、予期しない例外はerrorで記録する

詳細なドメイン、DB、公開API、入力API、Java規約はDocumentation mapから参照してください。

## Frontend実装ルール

- Next.js App Routerを使用し、Server Componentsを基本とする。Client Componentは必要最小限にする
- 既存のNext.jsプロジェクトを変更する場合は、作業前に [Next.js公式の既存プロジェクト向けAI Agentsガイド](https://nextjs.org/docs/app/guides/ai-agents#existing-projects) を確認する
- API呼び出しは `lib/api` を経由し、pageから直接 `fetch` しない
- UIはshadcn/uiをベースにし、Tailwind CSS v4のsemantic tokenを使う
- Noto Sans JPを使用し、PNGは `apps/web/public` 配下に置いて `next/image` で表示する
- 共通UIの主要propsを確認できる `Playground` storyを作る
- 参考画像やデザインイメージがある場合は、それを優先する

## 作業時の基本ルール

- 変更前に対象ファイルと関連ドキュメント、現在の実装を確認する
- 小さくレビューしやすい差分にし、依頼範囲外の変更を混ぜない
- コンテナ内でWebのbuild、test、lint、型チェック、依存更新を実行する場合は `vscode` ユーザーを使う
- Javaの規約・確認方法は `docs/java-coding-style.md`、テスト方針は `docs/test-strategy.md` を参照する
- Git操作で `.git/index.lock` が失敗した場合は、実在するlockか確認してから必要な環境で再実行する。無条件削除や広範囲の権限変更はしない

## Documentation map

| 知りたい情報 | 正となる文書 |
| --- | --- |
| プロジェクト概要・起動・環境変数 | `README.md` |
| サイトの目的・ページ構成・MVP範囲・UI方向性 | `docs/new-site-plan.md` |
| ドメイン概念・関係・ビジネスルール | `docs/domain-model.md` |
| DBテーブル・カラム・制約・インデックス | `docs/database-design.md` |
| 公開API・レスポンス・enum・エラー・集計 | `docs/api-design.md` |
| 将来の管理・入力API候補 | `docs/input-api-design.md` |
| 現在の実装状況・今後の候補 | `docs/implementation-roadmap.md` |
| Java規約・Formatter・確認コマンド | `docs/java-coding-style.md` |
| テストの種類・優先順位・配置 | `docs/test-strategy.md` |
| 共通UI・Storybook・Tailwind方針 | `docs/frontend-ui-guidelines.md` |
| 旧サイトの調査記録 | `docs/old-site-analysis.md` |

詳細設計をREADMEやAGENTS.mdへコピーせず、必要な正の文書を参照してください。
