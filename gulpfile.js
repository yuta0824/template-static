// Gulp及び必要なプラグインの読み込み
const { src, dest, series, watch, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const fs = require("fs");
const gcmq = require("gulp-group-css-media-queries");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssdeclsort = require("css-declaration-sorter");
const webp = require("gulp-webp");
const tinypng = require("gulp-tinypng-compress");

// パスの定義
const distBase = "./dist";
const distCss = `${distBase}/assets/css`;
const distImg = `${distBase}/assets/img`;
const srcImg = "./src/img/**";
const srcSass = "./src/scss/**/*.scss";
const srcSassFolderBase = "./src/scss/";
const srcSassFolders = [
	// _index.scssに@useでまとめたいフォルダを指定
	"component",
	"layout",
	"project",
	"library",
	"utility",
	"wp",
];

/**
 * _index.scssファイルに@useを追加する関数。指定されたフォルダ内の_scssファイルを
 * _index.scssに@useで読み込みます。
 */
const updateIndexWithUse = (done) => {
	srcSassFolders.forEach((folder) => {
		const dir = `${srcSassFolderBase}${folder}`;
		const files = fs
			.readdirSync(dir)
			.filter(
				(file) =>
					file.startsWith("_") &&
					file.endsWith(".scss") &&
					file !== "_index.scss"
			);

		let importContent = files
			.map((file) => `@use "${file.replace(/^_/, "").replace(".scss", "")}";`)
			.join("\n");
		fs.writeFileSync(`${dir}/_index.scss`, importContent);
	});
	done();
};

/**
 * Sassファイルをコンパイルする関数。SassファイルをCSSにコンパイルし、
 * 自動的にベンダープレフィックスを追加、メディアクエリをグループ化し、
 * CSSプロパティをアルファベット順にソートします。
 */
const compileSass = (done) => {
	src(srcSass)
		.pipe(
			plumber({
				errorHandler: notify.onError("Error:<%= error.message %>"),
			})
		)
		.pipe(sass())
		.pipe(postcss([autoprefixer()]))
		.pipe(
			postcss([
				cssdeclsort({
					order: "alphabetical",
				}),
			])
		)
		.pipe(gcmq())
		.pipe(dest(distCss));
	done();
};

/**
 * ファイル変更を監視し、変更があった場合にタスクを実行する関数。
 * scssファイルの変更を監視し、必要に応じてコンパイルします。
 */
const watchFiles = () => {
	const watchPattern = [srcSass, `!${srcSassFolderBase}**/_index.scss`];
	watch(watchPattern, series(updateIndexWithUse, compileSass));
};

/**
 * 画像ファイルをTinyPNGを使用して圧縮する関数。
 * PNG、JPG、JPEG形式の画像ファイルを対象に圧縮を行い、出力ディレクトリに保存します。
 */
const tinypngApi = "xxxxxxxxxxxxxxx"; // TinyPNGのAPI Key
const imageMiniTinypng = () => {
	return src([`${srcImg}/**.png`, `${srcImg}/**.jpg`, `${srcImg}/**.jpeg`])
		.pipe(
			tinypng({
				key: tinypngApi,
			})
		)
		.pipe(dest(distImg));
};

/**
 * 画像ファイルをTinyPNGで圧縮した後、WebP形式に変換する関数。
 * 圧縮と変換を組み合わせることで、サイズの削減とパフォーマンスの向上を図ります。
 */
const imageMiniWebpTinypng = () => {
	const webpQuality = 90; // WebPの圧縮率（0〜100）
	return src([`${srcImg}/**.png`, `${srcImg}/**.jpg`, `${srcImg}/**.jpeg`])
		.pipe(
			tinypng({
				key: tinypngApi,
			})
		)
		.pipe(
			webp({
				quality: webpQuality,
				method: 6,
			})
		)
		.pipe(dest(distImg));
};

// Gulpの公開タスク
exports.imgmin = imageMiniTinypng; // 画像圧縮タスク
exports.webp = imageMiniWebpTinypng; // WebP変換タスク
exports.default = series(compileSass, watchFiles); // デフォルトタスク
