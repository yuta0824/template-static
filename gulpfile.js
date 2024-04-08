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
	"component",
	"layout",
	"project",
	"library",
	"utility",
	"wp",
];

// SCSSファイルに@useを追加する関数
const updateIndexWithUse = (done) => {
	srcSassFolders.forEach((folder) => {
		const dir = `${srcSassFolderBase}${folder}`;
		// _index.scssを除外する条件を追加
		const files = fs
			.readdirSync(dir)
			.filter(
				(file) =>
					file.startsWith("_") &&
					file.endsWith(".scss") &&
					file !== "_index.scss"
			);

		let importContent = files
			.map((file) => `@use "${file.replace(".scss", "")}";`)
			.join("\n");
		fs.writeFileSync(`${dir}/_index.scss`, importContent);
	});
	done();
};

// Sassコンパイル
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

// 変更の監視
const watchFiles = () => {
	const watchPattern = [srcSass, `!${srcSassFolderBase}**/_index.scss`];
	watch(watchPattern, series(updateIndexWithUse, compileSass));
};

// 画像圧縮
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

//画像圧縮とwebP変換
const imageMiniWebpTinypng = () => {
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

// Gulpタスクを公開
exports.imgmin = imageMiniTinypng;
exports.webp = imageMiniWebpTinypng;
exports.default = series(compileSass, watchFiles);
