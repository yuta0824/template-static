# Template Static

## 開発環境

以下の環境で動作を確認しています。

- node v-18.16
- npm v-9.5.1

## ビルドツール

- gulp

## gulp コマンド

```
# パッケージのダウンロード
$ npm i

# コンパイル
$ npx gulp

# webp変換
$ npx gulp webp
```

## ファイル構造

- dist/・・・メインディレクトリ
- sass/・・・Sass ファイル群
- img/・・・Src 画像ファイル群
- package.json・・・Glup パッケージ
- gulpfile.js・・・Glup タスク
- .editorconfig・・・エディタルール
- .stylelintrc.json・・・Sass コーディングルール
