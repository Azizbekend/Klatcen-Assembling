const { src, dest, series, parallel, watch } = require("gulp");
const fs = require("fs");
const del = require("del");
const fileinclude = require('gulp-file-include');

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

// Настройки пути для WordPress
let project_name = __dirname + "/"; // Путь к теме WordPress
let src_folder = project_name + "#src";


const path = {
	build: {
		js: project_name + "assets/js/",
		css: project_name + "assets/css/",
		images: project_name + "assets/img/",
		fonts: project_name + "assets/fonts/",
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
		php: project_name + "./**/*.php"
	},
	clean: project_name + "assets/"
};

// BrowserSync
function browserSync(done) {
	browsersync.init({
		proxy: {
			target: "http://klatcen-wordpress-test/",
		},
		port: 3000, // Порт
		notify: false, // Отключить уведомления

		// https: true, // Включить HTTPS
		open: 'external', // Открывать внешний URL
		socket: {
			domain: 'klatcen-wordpress-test:3000',
			secure: true // Для HTTPS
		}
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
		.pipe(scss({ outputStyle: 'expanded' }).on('error', scss.logError))
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserslist: ["last 5 versions"],
			cascade: true
		}))
		.pipe(group_media())
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(rename({ suffix: ".min" }))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}

// JS
function js() {
	return src(path.src.js)
		.pipe(plumber())
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
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
	return src(src_folder + '/fonts/*.otf', { encoding: false })
		.pipe(plumber())
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest(src_folder + '/fonts/'));
}

// Fonts: TTF → WOFF/WOFF2
function fonts() {
	src(path.src.fonts, { encoding: false })
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
			if (items && items.length > 0) {
				const processedFonts = new Set();
				let fontDeclarations = '';

				items.forEach(item => {
					const fontParts = item.split('.');
					let fontname = fontParts[0];

					if (!processedFonts.has(fontname)) {
						let fontWeight = '400';
						let fontStyle = 'normal';

						if (fontname.toLowerCase().includes('light')) {
							fontWeight = '300';
						} else if (fontname.toLowerCase().includes('regular')) {
							fontWeight = '400';
						} else if (fontname.toLowerCase().includes('medium')) {
							fontWeight = '500';
						} else if (fontname.toLowerCase().includes('semibold')) {
							fontWeight = '600';
						} else if (fontname.toLowerCase().includes('bold')) {
							fontWeight = '700';
						} else if (fontname.toLowerCase().includes('italic')) {
							fontStyle = 'italic';
						}

						fontDeclarations += `@include font("${fontname}", "${fontParts[0]}", "${fontWeight}", "${fontStyle}");\n`;
						processedFonts.add(fontname);
					}
				});

				fs.writeFile(fontsFilePath, fontDeclarations, cb);
			} else {
				console.log('No font files found in directory');
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


function cssBuild() {
	return src(path.src.css, {})
		.pipe(plumber())
		.pipe(
			scss({ outputStyle: 'expanded' }).on('error', scss.logError)
		)
		.pipe(group_media())
		.pipe(
			autoprefixer({
				grid: true,
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(webpcss(
			{
				webpClass: "._webp",
				noWebpClass: "._no-webp"
			}
		))
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}


function jsBuild() {
	let appPath = path.build.js + 'app.min.js';
	let vendorsPath = path.build.js + 'vendors.min.js';
	del(appPath);
	del(vendorsPath);
	return src(path.src.js, {})
		.pipe(plumber())
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.on('error', function (err) { console.log(err.toString()); this.emit('end'); })
		.pipe(
			rename({
				suffix: ".min",
				extname: ".js"
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}

function imagesBuild() {
	return src(path.src.images, { encoding: false })
		.pipe(newer(path.build.images))
		.pipe(
			imagemin([
				webp({
					quality: 85
				})
			])
		)
		.pipe(
			rename({
				extname: ".webp"
			})
		)
		.pipe(dest(path.build.images))
		.pipe(src(path.src.images, { encoding: false }))
		.pipe(newer(path.build.images))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3 // 0 to 7
			})
		)
		.pipe(dest(path.build.images))
}


// Build tasks
let fontsBuild = series(fonts_otf, fonts, fontstyle);
let buildDev = series(clean, parallel(fontsBuild, css, js, images));
let watchProject = series(buildDev, parallel(watchFiles, browserSync));
let build = series(clean, parallel(cssBuild, jsBuild, imagesBuild, fontsBuild));

// Export
exports.fonts = fontsBuild;
exports.build = build;

exports.watch = watchProject;
exports.default = watchProject;
