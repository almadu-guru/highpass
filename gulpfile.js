const { src, dest, series, watch } = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const babel = require('gulp-babel');
const gulpif = require('gulp-if');
const argv = require('yargs').argv;
const notify = require('gulp-notify');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();


const clean = () => {
	return del(['dist'])
}

const resources = () => {
	return src('./src/resorces/fonts/**')
	  .pipe(dest('dist/resorces/fonts'))
  }

const stylesDev = () => {
return src('./src/css/**/*.css')
	.pipe(sourcemaps.init())
	.pipe(concat('style.css'))	
	.pipe(sourcemaps.write())
	.pipe(dest('dist/css'))
	.pipe(browserSync.stream());
}

const stylesBuild = () => {
	return src('./src/css/**/*.css')
	.pipe(concat('style.css'))
	.pipe(
		autoprefixer({
		cascade: false,
		})
	)
	.pipe(gulpif(argv.prod, cleanCSS({ 
		level: 2 
	})))
	.pipe(dest('dist/css'));
};

const html = () => {
	return src('src/**/*.html')	  
	  .pipe(dest('dist'))
	  .pipe(browserSync.stream());		
  }

const htmlMinify = () => {
  return src('src/**/*.html')
	.pipe(htmlMin({
		collapseWhitespace: true,
	}))
	.pipe(dest('dist'))
	.pipe(browserSync.stream());		
}

const svgSprites = () => {
	return src('./src/resorces/img/svg/**.svg')
	  .pipe(svgSprite({
		mode: {
		  stack: {
			sprite: "../sprite.svg" //sprite file name
		  }
		},
	  }))
	  .pipe(dest('dist/resorces/img'));
}

const images = () => {
	return src([		  
		  './src/resorces/img/*.svg',
		  './src/resorces/img/**/*.jpg',
		  './src/resorces/img/**/*.png',
		  './src/resorces/img/**/*.jpeg'
		  ])
	  .pipe(image())
	  .pipe(dest('dist/resorces/img'))
  };


const scriptsDev = () => {
return src([
	'./src/js/**/*.js'	
])
	.pipe(sourcemaps.init())
	.pipe(babel({
		presets: ['@babel/env']
	}))		
	.pipe(sourcemaps.write())		
	.pipe(dest('dist/js'))
	.pipe(browserSync.stream());
}

const scriptsBuild = () => {
 return src('./src/js/**/*.js')
   .pipe(
	 uglify({
	   toplevel: true,
	 })
   )
   .pipe(dest('dist/js'));
};


const watchFiles = () => {
	browserSync.init({
	  server: {
		baseDir: 'dist'
	  },
	});
}
watch('./src/*.html', html); 
watch('./src/css/**/*.css', stylesDev);
watch('./src/resorces/img/**/*.{jpg,jpeg,png}', images);
watch('./src/resorces/img/svg/**.svg', svgSprites);
watch('./src/js/**/*.js', scriptsDev);
watch('./src/resources/**', resources);


// exports.styles = styles;
// exports.scripts = scripts;
// exports.htmlMinify = htmlMinify;

exports.clean = clean;
exports.dev = series( 
	clean,
	resources,
	stylesDev,
	scriptsDev,
	html,
	images,
	svgSprites,
	watchFiles
);
exports.build = series(
	clean,
	resources,
	stylesBuild,
	scriptsBuild,
	htmlMinify,
	images,
	svgSprites
);

exports.default = exports.dev;