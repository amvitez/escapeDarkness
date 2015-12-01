var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-ruby-sass');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var prefix = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');

// Scripts Task
// Concats and Uglifies
gulp.task('scripts', function(){
	gulp.src(['pre-js/*.js', 'other path']);
		.pipe(concat('all.js'))
		.pipe(gulp.dest('js'));

	gulp.src('js/*.js')
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest('minjs'));
});

gulp.task('jshint', function(){
	gulp.src('javascriptzz')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Styles Task
// Uglifies
gulp.task('styles', function(){
	gulp.src('styles/**/*.scss')
		.pipe(plumber())
		.pipe(sass({
			style: 'compressed'
		}))
		.pipe(prefix('last 2 versions'))
		.pipe(gulp.dest('css/'));
});

// Images Task
// Compress
gulp.task('image', function(){
	gulp.src('img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('build/img'));
});

// Watch Task
// Watches JS
gulp.task('watch', function(){
	gulp.watch('js/*.js', ['scripts']);
	gulp.watch('scss/**/*.scss', ['styles']);
});

gulp.task('default', ['scripts', 'jshint', 'styles', 'image', 'watch']);