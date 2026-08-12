# 旧サイト分析メモ

対象: 削除前の `legacy/` に保存されていた旧サイトの調査記録
前提: 本文中の `src/`、`dbflute_cats/`、`mydbflute/` は旧サイト内部の相対パスを指す。
旧サイトの実体はTASK-01.5で削除済み。本文中の `legacy/` や内部パスは、削除前の構成を示すHistorical情報であり、現在の実在パスではない。

## 1. 削除前の旧サイト構成

削除前の `legacy/` 内を調査した時点では、主な構成は次の通りだった。

- `src/main/java/dev/baseballscore/cats`
  - Spring Boot アプリ本体
  - Controller / Service / 共通ユーティリティ / DBFlute 生成コード
- `src/main/resources`
  - Thymeleaf テンプレート
  - 静的資材
  - 設定ファイル
- `dbflute_cats`
  - DBFlute のスキーマ定義、置換 SQL、生成物出力、設定群
- `mydbflute/dbflute-1.1.9`
  - DBFlute 本体の配布一式
- `target`
  - Maven ビルド成果物
- ルートの補助ファイル
  - `pom.xml`
  - `compose.yaml`
  - `.env.example`
  - `README.md`
  - `beta_manual_ver1.0.pdf`

### ざっくりしたツリー

```text
.
├── src/
│   ├── main/java/com/maruchoko/cats/
│   └── main/resources/
├── dbflute_cats/
├── mydbflute/
├── target/
├── compose.yaml
├── pom.xml
├── README.md
└── beta_manual_ver1.0.pdf
```

## 2. 使用技術の推定

ファイル内容から、次の技術スタックが確認できた。

- Java 17
- Spring Boot 2.7.18
- Spring MVC
- Spring Security
- Thymeleaf
- Spring Validation
- Spring Mail
- JDBC
- DBFlute 1.1.9
- MySQL 8.4
- Docker Compose
- jQuery
- Bootstrap
- LINE Bot SDK

### 補足

- `pom.xml` で `spring-boot-starter-parent:2.7.18` を使用。
- `packaging` は `war`。
- `src/main/resources/templates/views/*.html` が Thymeleaf 画面。
- `src/main/resources/static/js/*.js` と `css/*.css` が従来フロントの資材。
- `dbflute_cats/schema/project-schema-cats.xml` と `src/main/java/com/maruchoko/cats/dbflute/**` から DBFlute 運用が明確。
- `SecurityConfig` と `LoginController` から、管理画面だけログイン必須の構成。

## 3. 公開ページ・管理ページ・DB関連・静的資材の分類

### 公開ページ

以下は一般公開向けの画面として確認できた。

- `/` トップ
- `/games` 試合一覧
- `/games/{id}/detail` 試合詳細
- `/stats` 個人成績
- `/players` 選手一覧
- `/contact` お問い合わせ
- `/sent` 送信完了
- `/login` ログイン画面

対応テンプレートの例:

- `src/main/resources/templates/views/index.html`
- `src/main/resources/templates/views/games.html`
- `src/main/resources/templates/views/games-detail.html`
- `src/main/resources/templates/views/stats.html`
- `src/main/resources/templates/views/players.html`
- `src/main/resources/templates/views/contact.html`
- `src/main/resources/templates/views/sent.html`
- `src/main/resources/templates/views/login.html`

### 管理ページ

管理系は `/admin` 配下に集約されている。

- `/admin` 管理者ホーム
- `/admin/schedules`
- `/admin/schedules/add`
- `/admin/schedules/{id}/edit`
- `/admin/scores`
- `/admin/scores/add`
- `/admin/scores/{id}/edit`
- `/admin/players`
- `/admin/players/add`
- `/admin/players/{id}/edit`
- `/admin/info`
- `/admin/info/add`
- `/admin/info/{id}/edit`

対応テンプレートの例:

- `src/main/resources/templates/views/admin.html`
- `src/main/resources/templates/views/admin/schedules.html`
- `src/main/resources/templates/views/admin/schedules-add.html`
- `src/main/resources/templates/views/admin/schedules-edit.html`
- `src/main/resources/templates/views/admin/scores.html`
- `src/main/resources/templates/views/admin/scores-add.html`
- `src/main/resources/templates/views/admin/scores-edit.html`
- `src/main/resources/templates/views/admin/players.html`
- `src/main/resources/templates/views/admin/players-add.html`
- `src/main/resources/templates/views/admin/players-edit.html`
- `src/main/resources/templates/views/admin/info.html`
- `src/main/resources/templates/views/admin/info-add.html`
- `src/main/resources/templates/views/admin/info-edit.html`

### DB関連

#### DBFlute の設定・定義

- `dbflute_cats/schema/project-schema-cats.xml`
- `dbflute_cats/dfprop/*.dfprop`
- `dbflute_cats/playsql/*.sql`
- `dbflute_cats/output/doc/*.html`
- `src/main/resources/dbfluteBeans.xml`
- `mydbflute/dbflute-1.1.9/**`

#### 生成済みコード

`src/main/java/com/maruchoko/cats/dbflute/**` 配下は DBFlute 自動生成コード。

- `exbhv`
- `bsbhv`
- `bsentity`
- `cbean`
- `exentity`
- `allcommon`

#### テーブル一覧

スキーマ定義から確認できたテーブルは次の 22 個。

- `batting_detail`
- `batting_score`
- `game`
- `game_result_pattern`
- `line`
- `pitching_score`
- `player`
- `player_position`
- `point`
- `position`
- `roles`
- `round`
- `score`
- `score_mark`
- `sponsor`
- `stadium`
- `team`
- `throw_bat_type`
- `tournament`
- `user_details`
- `user_roles`
- `users`

### 静的資材

- CSS
  - `src/main/resources/static/css/styles.css`
  - `src/main/resources/static/css/login.css`
- JavaScript
  - `src/main/resources/static/js/common.js`
  - `src/main/resources/static/js/contact/contact.js`
  - `src/main/resources/static/js/games/games.js`
  - `src/main/resources/static/js/info/info.js`
  - `src/main/resources/static/js/players/players.js`
  - `src/main/resources/static/js/schedules/schedules.js`
  - `src/main/resources/static/js/scores/score-tables.js`
  - `src/main/resources/static/js/scores/scores.js`
  - `src/main/resources/static/js/stats/stats.js`
- 画像
  - `src/main/resources/static/img/logo.png`
  - `src/main/resources/static/img/main.jpg`
  - `src/main/resources/static/img/loading.gif`
  - `src/main/resources/static/img/cats.ico`
- 参考資料
  - `beta_manual_ver1.0.pdf`

## 4. 新サイトで再利用できそうな資材

以下は旧サイト調査時点の再利用候補であり、現在の機能追加や削除を決めるものではない。

### そのまま再利用候補

- チーム名や文言
  - 「新琴似CATS」
  - 草野球チーム紹介文
  - 連絡導線の文言
- 画像素材
  - `logo.png`
  - `main.jpg`
  - `cats.ico`
- コンテンツ構造
  - 試合一覧
  - 試合詳細
  - 個人成績
  - 選手一覧
  - お問い合わせ
- 画面部品の考え方
  - ナビゲーション
  - フッター
  - メッセージ表示
  - ページング
  - テーブル一覧
  - モーダル

### 条件付きで再利用候補

- `beta_manual_ver1.0.pdf`
  - 旧サイトの見た目・情報設計の参考資料として使える
- `dbflute_cats/schema/project-schema-cats.xml`
  - 現行DBを把握する設計資料として使える
- `dbflute_cats/playsql/*.sql`
  - 初期データや差分調査の参照に使える
- `src/main/resources/templates/parts/**`
  - Next.js 化後も、画面構成の設計参考として有効
- `src/main/resources/static/js/common.js`
  - ページング、ローディング、モーダル操作などの振る舞い設計の参考になる

## 5. 削除前の整理メモ

以下は旧サイト削除前の調査時点の整理であり、現在のファイル状態や削除方針を示すものではない。

### 削除前に残す価値があると判断したもの

- `src/main/resources/templates/**`
  - 旧サイトの表示資産。Before として残す価値が高い。
- `src/main/resources/static/**`
  - 旧フロントの実装資産。デザイン比較や移植の参照に使える。
- `src/main/java/com/maruchoko/cats/controller/**`
  - 画面遷移や機能切り出しの確認用に残す。
- `src/main/java/com/maruchoko/cats/service/**`
  - 既存の業務ロジック把握に必要。
- `dbflute_cats/**`
  - 現行 DB と生成ルールの参照に必要。
- `beta_manual_ver1.0.pdf`
  - Before の画面資料として残す。

### 削除前に将来の削除候補としたもの

前提として「新サイトへ機能移行が終わった後」の候補。

- `target/`
  - ビルド生成物なので保持不要
- `logs/`
  - ローカル生成ログなら不要
- `src/main/java/com/maruchoko/cats/dbflute/**`
  - Spring Boot + API 層へ移行して DBFlute を外すなら削除候補
- `src/main/resources/dbfluteBeans.xml`
  - DBFlute 依存を外すなら不要
- `mydbflute/dbflute-1.1.9/**`
  - DBFlute の生成ツール自体を使わなくなるなら不要
- `src/main/resources/templates/**`
  - Next.js にフロントを完全移行するなら最終的に削除候補
- `src/main/resources/static/js/**`
  - 同上
- `src/main/resources/static/css/**`
  - 同上

### すぐ削除しなくてよいが、整理したいもの

- `.DS_Store`
  - 収集時に混入した macOS の補助ファイル
- `target/generated-sources/**`
  - Maven 生成物のため、手作業で触らず再生成前提

## 6. 現在のリポジトリでの扱い

- 旧サイトのコード、DBFlute資材、静的資材、dumpは、削除前は `legacy/` に保存されていた
- 旧サイトの実体は削除済みであり、この文書は旧仕様の比較・調査記録として残す
- 新しいWebは `apps/web`、新しいAPIは `apps/api` に配置し、旧サイトの命名や画面構成を直接引き継がない
- 旧サイトの情報は、Before比較、旧データの調査、再利用候補の確認に限って参照する
- 新アプリの現在の実装状況と今後の順序は [実装ロードマップ](implementation-roadmap.md) を正とする

## 7. 調査結果の要約

- 旧サイトは公開画面と管理画面が同居した Spring Boot + Thymeleaf アプリだった
- DBFluteと旧DBスキーマが画面・業務ロジックと密結合していた
- 旧サイトは新アプリへ直接移行せず、公開サイトと公開APIとして再設計する方針を採用している
