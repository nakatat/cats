# Java Coding Style

このドキュメントでは、Java のコーディング規約、Formatter、テスト実装で使う技術、開発時の確認コマンドを定義します。

## var の利用

- ローカル変数では、右辺から型が明らかな場合は `var` を使用する
- コンストラクタ呼び出し、factory method、mapper結果、service結果、collection生成など、型推論しても読みやすい場合は `var` を優先する
- `var` によって型が分かりにくくなる場合は、明示的な型を書く
- primitive literal、`null`、複雑な chain、戻り値の型が推測しにくいメソッド呼び出しでは、無理に `var` を使わない
- フィールド、メソッド引数、戻り値、public API signature では `var` を使わない
- DTO、Row、Mapper、Service などのクラス定義やフィールド定義は明示的な型を維持する

## this の利用

- インスタンスフィールドへのアクセスには、原則として `this.` を付ける
- インスタンスメソッドの呼び出しにも、原則として `this.` を付ける
- コンストラクタインジェクションでフィールドへ代入する場合も `this.field = field;` と書く
- ローカル変数、メソッド引数、static メソッド、static 定数には `this.` を付けない
- `private static` helper method の呼び出しには `this.` を付けない
- `static import` している test assertion や Mockito メソッドには `this.` を付けない
- 可読性が下がる場合や Java の文法上不要・不適切な場合は付けない

## テスト実装で使う技術

- JUnit 5 を基本のテストフレームワークにする
- Spring Boot Test は integration test で必要な場合に使う
- MockMvc は Controller / Web API の HTTP 応答確認に使う
- Mockito は Service や Mapper を差し替える軽量テストで使う
- AssertJ は可読性が必要な assertion で使う
- Testcontainers は Mapper / Integration Test を厚くする段階で導入を検討する
- JaCoCo はカバレッジ管理が必要になった段階で導入を検討する

## Formatter

- Java の import 整理と不要 import の削除は Spotless で行う
- Java コードを変更した後は、必要に応じて `mvn -f apps/api/pom.xml spotless:apply` を実行する
- CI では `mvn -f apps/api/pom.xml spotless:check` を実行する
- `var` / `this.` の方針は Spotless では自動化できないため、実装時に判断する

## 確認コマンド

Java/API を変更した場合は、変更内容に応じて必要な範囲で次を実行する。

```bash
mvn -f apps/api/pom.xml spotless:apply
mvn -f apps/api/pom.xml spotless:check
mvn -f apps/api/pom.xml -q -DskipTests compile
mvn -f apps/api/pom.xml test
git diff --check
```

全テストが重い場合は、対象テストだけを指定して実行してもよい。

必要に応じてアプリを起動し、Swagger UI や API の動作も確認する。

```bash
mvn -f apps/api/pom.xml spring-boot:run
curl -i http://localhost:8081/api/health
```

Swagger UI:

```text
http://localhost:8081/api/swagger-ui.html
```

## 参照ドキュメント

- [テスト方針](test-strategy.md)
- [実装ロードマップ](implementation-roadmap.md)
