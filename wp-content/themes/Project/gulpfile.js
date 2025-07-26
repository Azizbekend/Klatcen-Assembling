const { src, dest, series, parallel, watch } = require("gulp");
const fs = require("fs");
const del = require("del");

const plumber = require("gulp-plumber");
const browsersync = require("browser-sync").create();

const scss = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const group_media = require("gulp-group-css-media-queries");
const clean_css = require("gulp-clean-css");
const rename = require("gulp-rename");

const newer = require("gulp-newer");
const imagemin = require("gulp-imagemin");
const webp = require("imagemin-webp");

const fonter = require("gulp-fonter");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");

const src_folder = "#src";

const path = {
	build: {
		js: "./assets/js/",
		css: "./assets/css/",
		images: "./assets/img/",
		fonts: "./assets/fonts/"
	},
	src: {
		js: [src_folder + "/js/app.js", src_folder + "/js/vendors.js"],
		css: src_folder + "/scss/style.scss",
		images: [src_folder + "/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}"],
		fonts: src_folder + "/fonts/*.ttf"
	},
	watch: {
		js: src_folder + "/**/*.js",
		css: src_folder + "/scss/**/*.scss",
		images: src_folder + "/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}",
		php: "./**/*.php"
	},
	clean: "./assets/"
};

// BrowserSync
function browserSync(done) {
	browsersync.init({
		proxy: "http://klatcen-testing",
		port: 3000,
		notify: false
	});
	done();
}

// PHP Watch (reload только)
function phpReload(done) {
	browsersync.reload();
	done();
}

// SCSS → CSS
function css() {
	return src(path.src.css)
		.pipe(plumber())
		.pipe(scss({ outputStyle: "expanded" }).on("error", scss.logError))
		.pipe(rename({ extname: ".min.css" }))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}

// JS
function js() {
	return src(path.src.js)
		.pipe(plumber())
		.pipe(rename({ suffix: ".min", extname: ".js" }))
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}

// Images
function images() {
	return src(path.src.images)
		.pipe(newer(path.build.images))
		.pipe(dest(path.build.images));
}

// Fonts: OTF → TTF
function fonts_otf() {
	return src(src_folder + "/fonts/*.otf")
		.pipe(plumber())
		.pipe(fonter({ formats: ["ttf"] }))
		.pipe(dest(src_folder + "/fonts/"));
}

// Fonts: TTF → WOFF/WOFF2
function fonts() {
	src(path.src.fonts)
		.pipe(plumber())
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts));

	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts));
}

// Fonts SCSS Generator
function fontstyle(done) {
	const fontsFile = src_folder + "/scss/common/fonts.scss";
	if (!fs.existsSync(fontsFile)) fs.writeFileSync(fontsFile, "");

	const fileContent = fs.readFileSync(fontsFile);
	if (fileContent === "") {
		fs.readdir(path.build.fonts, (err, items) => {
			if (items) {
				let cFontname;
				for (let i = 0; i < items.length; i++) {
					let fontname = items[i].split(".")[0];
					if (cFontname !== fontname) {
						fs.appendFileSync(fontsFile, `@include font("${fontname}", "${fontname}", "400", "normal");\r\n`);
					}
					cFontname = fontname;
				}
			}
		});
	}
	done();
}

// Clean assets folder
function clean() {
	return del(path.clean);
}

// Watch
function watchFiles() {
	watch([path.watch.css], css);
	watch([path.watch.js], js);
	watch([path.watch.images], images);
	watch([path.watch.php], phpReload);
}

// Build tasks
const fontsBuild = series(fonts_otf, fonts, fontstyle);
const build = series(clean, parallel(fontsBuild, css, js, images));
const dev = series(build, parallel(watchFiles, browserSync));

// Export
exports.fonts = fontsBuild;
exports.clean = clean;
exports.build = build;
exports.default = dev;
