# Gitブランチ運用

## 目的

`main` を本番デプロイの基準ブランチとして安定させ、変更内容と確認結果をレビュー可能な形で統合する。

## ブランチの役割

- `main`: 本番デプロイの基準ブランチ。直接コミットしない。
- `fix/<short-description>`: バグ修正、障害対応、設定修正などの保守作業に使う。
- `feature/<short-description>`: 新機能や利用者向けの機能追加に使う。

ブランチ名は小文字の kebab-case で、変更目的が分かる短い名前にする。例:

```text
fix/neon-idle-timeout
feature/player-search
```

## 作業の開始

作業開始時は、現在の変更を確認してから `main` を最新化し、作業ブランチを作成する。

```bash
git status --short --branch
git switch main
git pull --ff-only
git switch -c fix/<short-description>
```

新機能の場合は `fix/` を `feature/` に置き換える。

未コミットの変更がある場合は、それを破棄したり無関係なブランチへ持ち込んだりしない。既存作業を完了・退避するか、必要に応じて別worktreeを使ってからブランチを作成する。

## コミット

- 依頼された変更に関係するファイルだけを編集・ステージする。
- ステージ前後に `git diff` と `git diff --cached --name-only` で差分と対象ファイルを確認する。
- テストやFormatterなど、変更に対応する確認を実行してからコミットする。
- 生成物や無関係な既存変更はコミットに含めない。
- `.git/index.lock` のエラー時は、実在するロックか確認してからGit操作を再実行する。ロックを無条件に削除しない。

```bash
git diff --check
git diff --cached --name-only
git commit -m "短い変更目的"
```

## PushとPR

コミット後、作業ブランチをリモートへpushし、`main` をマージ先とするPRを作成する。

```bash
git push -u origin <branch-name>
```

PRには、原因、変更目的、変更範囲、実行した確認コマンドと結果を記載する。`main` へ直接pushせず、PR上で差分とCI結果を確認する。

このリポジトリのGitHub Actionsは次の条件で動作する。

- API CIは `apps/api/**` またはAPIワークフローの変更を含むpushで、Spotless確認とMavenテストを実行する。
- フロントエンドCIは対象パスのpushまたはPRで、quality、component、E2Eの確認を実行する。
- `main` へのpushでは、成功したCIの後にAPIはRender、フロントエンドはVercelへのデプロイ処理が実行される。

そのため、PRのGitHub Actionsが成功していること、レビューで問題がないことを確認してから `main` にマージする。CIが失敗した場合は、原因を修正して再確認するまでマージしない。

## マージ後のブランチ削除

マージ後、未コミットの変更がないことを確認してから、ローカルとリモートの作業ブランチを削除する。

```bash
git switch main
git pull --ff-only
git status --short --branch
git branch -d <branch-name>
git push origin --delete <branch-name>
```

`git branch -D` は、通常のマージ済み確認を迂回して削除するため、通常運用では使わない。未マージの変更を含むブランチを削除する必要がある場合は、削除対象と理由を確認してから別途判断する。

## 禁止事項

- `main` への直接コミット・直接push
- 依頼範囲外のファイルを混ぜたコミット
- 確認なしの `git reset --hard`、`git checkout --`、強制push
- CI結果やレビュー結果を確認しないままのマージ
- 未マージのブランチを確認なしに削除すること
