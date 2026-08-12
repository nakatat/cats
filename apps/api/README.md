# cats-api

新琴似CATS の新バックエンドです。

## 起動

```bash
mvn -f apps/api/pom.xml spring-boot:run
```

もし `apps/api` に移動してから起動したい場合は、次でもよいです。

```bash
cd apps/api
mvn spring-boot:run
```

起動時に Flyway が実行され、`apps/api/src/main/resources/db/migration` にあるマイグレーションが自動で適用されます。
現在の初期構成は、スキーマ・seed・イニングスコア補正をまとめた
`V1__create_initial_schema.sql` です。seed は旧データを変換した raw data で、公開確認用の初期データとして使います。

旧データに対戦相手の安打・失策は保存されていなかったため、現在のV1 seedでは相手側の `hits` と `errors` を `0` としています。

DB がまだ起動していない場合は、先にルートの `compose.yaml` で PostgreSQL を起動してください。

```bash
docker compose up -d postgres
```

Dev Container で開発環境を起動すると、PostgreSQL は `postgres` コンテナ、API は `workspace` コンテナ内で動作します。
Dev Container 内で上記の `mvn` コマンドを実行してください。`DATABASE_URL` などの接続設定は
`.devcontainer/devcontainer.json` から渡されます。

## 開発時の反映

- `spring-boot-devtools` を入れているので、Java の変更は再起動で反映されやすくなっています
- VS Code では `java.autobuild.enabled` を有効にしてあるので、保存時にビルドが走りやすいです
- 反映が遅いときは、一度プロセスを止めて起動し直すと確実です

## テスト

```bash
mvn -f apps/api/pom.xml test
```

## フォーマット

```bash
mvn -f apps/api/pom.xml spotless:apply
mvn -f apps/api/pom.xml spotless:check
```

コミット前にステージ済みのJavaファイルだけを整形する場合は、次を実行します。

```bash
./apps/api/format-staged-java.sh
```

lint-stagedからJavaファイルをコミットするときも、このスクリプトが実行されます。

## ログ確認

- API リクエストごとに method / uri / status / durationMs / clientIp をコンソールへ出します
- request body / response body は出しません
- 想定内エラーは warn、予期しない例外は error で出します
- 標準起動では `info` ログにしてあり、Spring Boot の condition evaluation report は出しません
- 詳細ログを見たいときだけ `SPRING_PROFILES_ACTIVE=local` や `--debug` を使ってください

確認例:

```bash
curl http://localhost:8081/api/health
curl http://localhost:8081/api/teams/cats
curl http://localhost:8081/api/teams/nope
```

## 確認URL

- Health: `http://localhost:8081/api/health`
- Swagger UI: `http://localhost:8081/api/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8081/api/v3/api-docs`

### 本番環境（Render）

- API: `https://cats-c0l7.onrender.com`
- Health: `https://cats-c0l7.onrender.com/api/health`
- Swagger UI: `https://cats-c0l7.onrender.com/api/swagger-ui/index.html`
- OpenAPI JSON: `https://cats-c0l7.onrender.com/api/v3/api-docs`

API の外部公開URLは `/api/...` のままです。Controller には `/api` を直接書かず、`spring.mvc.servlet.path=/api` で base path を付与しています。

## 環境変数

- `SERVER_PORT`
- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `CORS_ALLOWED_ORIGINS`（本番は `https://cats-ochre.vercel.app`、複数指定はカンマ区切り）
