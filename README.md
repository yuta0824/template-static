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

## gulpfile.js の設定

### Sass の分割ファイルをまとめるタスク

`srcSassFolders`の指定をしてください。<br>
この中に、分割したパーシャルファイルを index.scss でまとめたいフォルダを指定してください。

```
const srcSassFolders = [
	// _index.scssに@useでまとめたいフォルダを指定
	"component",
	"layout",
	"project",
	"library",
	"utility",
	"wp",
];
```

### 画像圧縮 tinyPNG

画像の圧縮には [tinypng](https://tinypng.com/) を使用します。<br>
API を取得し、API キーを入力してください。<br>
[Developer API](https://tinypng.com/developers)

```
const tinypngApi = "xxxxxxxxxxxxxxx"; // TinyPNGのAPI Key
```

### WebP変換
WebPの圧縮率を0〜100の間で適宜調整してください。
数値が低いほど圧縮率は高くなりますが、クオリティは低くなります。
```
const webpQuality = 90;
```


## ファイル構造

- dist/・・・メインディレクトリ
- src/・・・コンパイル前のファイル群
  - sass/・・・Sass ファイル群
  - img/・・・Src 画像ファイル群
- package.json・・・Glup パッケージ
- gulpfile.js・・・Glup タスク
- .editorconfig・・・エディタルール
- .stylelintrc.json・・・Sass コーディングルール
