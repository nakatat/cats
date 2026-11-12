# Java / Node.js のセキュリティ更新

対象: [Issue #3](https://github.com/nakatat/cats/issues/3)。確認日: 2026-11-12。
Java 21 / Node.js 22 のメジャーバージョンは維持する。

## 採用するイメージ

API のビルド・開発用 JDK と実行用 JRE は Temurin `21.0.13+9` を使う。
`apps/api/Dockerfile` では Noble ベースの公式イメージをタグと multi-platform digest で固定する。
Maven `3.9.11` の公式イメージは再取得しても JDK `21.0.9+10` だったため、
`/usr/share/maven` のツール本体だけをコピーし、修正版 JDK で実行する。

Web の Dockerfile の全ステージは Node.js `22.23.5` の Bookworm slim を使う。
10月の基準版 `22.23.4` に加え、11月11日の同じ22系のセキュリティ更新を含む。
Vercel のプロジェクト設定と `package.json` の `engines.node` は `22.x` を維持する。

digest を固定したイメージには、タグの再取得だけでは将来の更新は入らない。
次の更新時も公式情報を確認し、タグと digest を更新して、ビルド・テスト・再デプロイを行う。
Dev Container の Java / Node.js は `.devcontainer/devcontainer.json` の features で導入する別経路であり、
Dockerfile の更新だけでは既存の Dev Container は更新されない。再構築後に実バージョンを確認する。

## eMudhra に関する判断

Oracle の CVE-2026-91403 は `21.0.13` も影響対象としているため、番号だけで完了とは判定しない。
Adoptium は Temurin `21.0.13+9` が NSS `3.131.1` の証明書リストを使い、
eMudhra の侵害に対応済みであると発表している。後続の発表では CVE-2026-114820 として説明している。

Temurin は Mozilla の証明書リストを使い、Oracle JDK と信頼ストアが異なる。
`emSign ECC Root CA - G3` と `AAA Certificate Services` の除去を確認する。
`emSign Root CA - G2` も含まれない。
`emSign Root CA - G1` は Mozilla の判断により残っているため、G1 の存在だけで未修正とはしない。
独自の信頼ストアや `USE_SYSTEM_CA_CERTS` を使う場合は、その実際のストアを別途確認する。

根拠:

- [Oracle Security Alert](https://www.oracle.com/security-alerts/alert-cve-2026-91403.html)
- [Temurin の eMudhra 対応と検証上の注意](https://adoptium.net/news/2026/10/temurin-october-2026-emudhra/)
- [Temurin 2026年10月リリース](https://adoptium.net/news/2026/10/eclipse-temurin-17021-21013-2505-2701-available)
- [Node.js 2026年10月セキュリティ更新](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)
- [Node.js 22.23.5](https://nodejs.org/en/blog/release/v22.23.5)

## 更新時の確認

```bash
docker build --pull --target base -t cats-api-build-check apps/api
docker run --rm cats-api-build-check mvn -version
docker run --rm -v "$PWD/apps/api:/workspace" -w /workspace \
  cats-api-build-check mvn --batch-mode --no-transfer-progress spotless:check verify
docker build --pull -t cats-api-runtime-check apps/api
docker run --rm --entrypoint java cats-api-runtime-check -version
docker run --rm --entrypoint keytool cats-api-runtime-check \
  -list -v -cacerts -storepass changeit
docker build --pull --target dev -t cats-web-dev-check apps/web
docker run --rm --entrypoint node cats-web-dev-check --version
```

Web の lint・typecheck・test・build は、`vscode` ユーザーのコンテナ内で実行する。
新しい PostgreSQL に対して API を起動し、Flyway migration、`/api/health`、
DBを読む `/api/teams/cats` と `/api/teams/cats/summary` を確認する。
Web もその API を使って起動・HTTP 応答を確認する。

## 本番環境

本番への統合は [Git ブランチ運用](git-branch-workflow.md) に従う。
PR のマージ後は main の CI が Render / Vercel へデプロイする。
既存 main の再ビルドによるランタイム更新と、PR 内のイメージ固定の反映は区別して記録する。

Render の対象は `cats` (`srv-d9lg7tad0e5s73cff390`)。
更新前の live deploy は `dep-d9ut53favr4c73bfll5g`、コミットは
`d828427092f24f908f347ecc1ab674ff8718dbbe` で、2026-11-12 の起動ログは Java `21.0.11` だった。
再ビルドでは build cache を消去し、deploy ID と `live` 到達、起動ログの Java バージョン、
ヘルスチェックとDB読み取りを確認する。Free プランでは SSH / Dashboard Shell が使えないため、
本番で直接 `java -version` を実行したという扱いにはしない。

Vercel の対象は `cats` (`prj_ZbwScdtogGpGjJWoFtGlfISWAnmg`)。
更新前の本番 deployment は `dpl_7rpgNPhAG25SeTb6eFT1e5HGRYZv`、同じ main コミットだった。
そのデプロイは prebuilt で、Vercel のビルドログに Node.js のパッチ版は残っていない。
Vercel はビルドと Functions のマイナー・パッチ更新を管理するが、両者の実バージョンは異なり得る。
`22.x` 設定だけをパッチ適用の証拠にはしない。

eMudhra の証明書更新は既存デプロイにも再デプロイなしで適用される。
一方、Brotli の告知は10月28日11時 PT 以降の新しいデプロイで修正版を使うとしており、
既存プロジェクトの再デプロイも案内しているため、今回の本番 Web も再デプロイして確認する。
ビルドの `node -v` と Function 内の `process.version` は別々の証拠として扱う。

- [Render のデプロイ](https://render.com/docs/deploys)
- [Render の Shell 対応プラン](https://render.com/docs/ssh)
- [Vercel の Node.js バージョン管理](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Vercel の eMudhra 対応](https://vercel.com/kb/bulletin/emudhra-security-advisory-compromised-intermediate-ca-keys)
- [Vercel の Brotli 対応と再デプロイ](https://vercel.com/kb/bulletin/node-js-security-advisory)

## 2026-11-12 の実施結果

- 固定した JDK と JRE は `21.0.13+9-LTS`。両方の信頼ストアで上記3ルートの不在と
  通常の HTTPS 接続の成功を確認した。JRE は linux/arm64 と linux/amd64 で確認した。
  侵害された中間証明書の全テストホストやコード署名の個別検証は行っていない。
- API の `spotless:check verify` は174テスト、失敗・エラー・スキップ0で成功。
  `docker build --pull` も成功し、空の PostgreSQL 18 に2 migrationを適用できた。
  health、チーム取得、チーム集計の HTTP 応答を確認した。
- Web は `vscode` ユーザーで Node.js `22.23.5` の lint、typecheck、49 unit tests、
  `NODE_ENV=production pnpm build` が成功。起動後のトップページは HTTP 200 でチーム名を表示した。
- Render は既存 main を cache 消去付きで再ビルドし、`dep-dbqopuajnfac739b85g0` が
  2026-11-12 18:58 JST に `live` となった。新しいインスタンス `xkdx2` の起動ログは Java `21.0.13`。
  ビルドログで取得した runtime イメージは `eclipse-temurin:21-jre` の digest
  `sha256:18bb4a91a3dea3f03ee31d3755af34dfb40f904fc77ab56cdc2f092e32fff9c2`。
  health、チーム取得、チーム集計は正常応答だった。
- Vercel は同じ main を cache なしで再ビルドし、`dpl_46NZR3bS1hYWubgm958Bs6826mrk` が
  `READY` になり、本番ドメインへ割り当てられた。ビルドログの `node --version` は `v22.23.5`。
  本番 Web は HTTP 200 でチーム名を表示した。Functions 内の `process.version` は直接取得しておらず、
  実行ランタイムの修正適用は、Vercel の新規デプロイに関する公式告知と再デプロイ完了を根拠にしている。
- 上記の本番再デプロイに、PR 内の Dockerfile 固定変更はまだ含まれない。
  ビルド用 JDK の固定を含むリポジトリ変更の反映は、PR のレビュー・マージ後に行う。
