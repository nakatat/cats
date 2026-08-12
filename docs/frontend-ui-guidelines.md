# フロントエンド UI 方針

## 共通コンポーネント

- shadcn/ui をベースにする
- 用途固有の便利 props を増やしすぎない
- children で組み立てる構造コンポーネントを基本とする
- feature 固有の表示は共通 UI の組み合わせで実装する

## Storybook

- 共通 UI コンポーネントには Playground story を必ず作る
- variant がある場合は Variants story を作る
- size がある場合は Sizes story を作る
- disabled / loading などの状態がある場合は States story を作る
- 実際の画面に近い使用例も追加する

## Playground story

共通 UI コンポーネントには `Playground` を必ず作成する。

Playground では次を Controls から変更できるようにする。

- variant
- size
- disabled
- loading
- その他、そのコンポーネントの主要な公開 props

children の構造が複雑な場合でも、代表的な children を args に設定する。

## Card

- Card は汎用の表示枠に留める
- CardFooter は背景色や区切り線をデフォルトで持たない
- 帯状 footer は利用側で className を指定する
- StatCard / GameCard などは Card 本体の props にせず、使用例または feature component として実装する

## Badge

- Badge は状態や分類を示す補助ラベルとして扱い、過度な pill 形状は避ける
- 共通の `variant` と children の組み合わせで表現し、用途固有 props や状態専用 variant を安易に増やさない
- 操作できない Badge に hover 表現を付けない

## Tailwind CSS v4

- semantic token を使用する
- CSS variable の直接参照は原則避ける
- 通常の spacing utility を使う
- `--spacing()` 系の記法は使わない
