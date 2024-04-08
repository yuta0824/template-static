const { src, dest, series, watch, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const fs = require("fs");
const gcmq = require("gulp-group-css-media-queries");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssdeclsort = require("css-declaration-sorter");

// パスの定義
const distBase = "./dist";
const distCss = `${distBase}/assets/css`;
const srcSass = "./scss/**/*.scss";
const srcSassFolderBase = "./scss/";
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

// Gulpタスクを公開
exports.default = series(compileSass, watchFiles);
