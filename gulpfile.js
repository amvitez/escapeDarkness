var gulp = require('gulp');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var prefix = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var less = require('gulp-less');

// Scripts Task
// Concats and Uglifies
gulp.task('clientScripts', function(){
	return gulp.src(['src/client/js/app.js',
			  'src/client/js/factories/*.js',
			  'src/client/js/controllers/*.js'])
		.pipe(concat('scripts.js'))
		.pipe(uglify({ mangle: false }))
		.pipe(gulp.dest('dist/client/js'));
});

gulp.task('json', function(){
	return gulp.src(['src/client/js/*.json'])
		.pipe(gulp.dest('dist/client/js'));
});

gulp.task('serverScripts', function(){
	return gulp.src(['src/server/**/*'])
		.pipe(uglify({ mangle: false }))
		.pipe(gulp.dest('dist/server'));
});

gulp.task('views', function(){
	return gulp.src(['src/client/views/*'])
		.pipe(gulp.dest('dist/client/views'));
});

gulp.task('jshint', function(){
	return gulp.src(['src/client/js/**/*.js','src/server/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Styles Task
gulp.task('styles', function(){
	return gulp.src(['src/client/stylesheets/style.less'])
		.pipe(plumber())
		.pipe(less())
		.pipe(gulp.dest('dist/client/stylesheets/'));
});

// Images Task
// Compress
gulp.task('images', function(){
	return gulp.src('src/client/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/client/images'));
});

gulp.task('audio', function(){
	return gulp.src('src/client/audio/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/client/audio'));
});

// Watch Task
// Watches JS
gulp.task('watch', function(){
	gulp.watch('src/client/js/**/*.js', ['clientScripts', 'jshint']);
	gulp.watch('src/server/**/*.js', ['serverScripts', 'jshint']);
	gulp.watch('src/client/views/*', ['views']);
	gulp.watch('src/client/js/*.json', ['json']);
	gulp.watch('src/client/stylesheets/style.less', ['styles']);
	gulp.watch('src/client/images/*', ['images']);
	gulp.watch('src/client/audio/*', ['audio']);
});

gulp.task('default', ['jshint', 'clientScripts', 'serverScripts', 'json', 'styles', 'views', 'images', 'audio', 'watch']);




