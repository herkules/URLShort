var gulp 			= require('gulp'),
	sass 			= require('gulp-sass'),
	livereload 		= require('gulp-livereload'),  
    notify 			= require('gulp-notify'),
    uglify 			= require('gulp-uglify'),
	browserify 		= require('gulp-browserify');
	
var src_dir 	= './src';
var build_dir 	= './public';

gulp.task('js', function () {
	return gulp.src(src_dir + '/js/**/*.js')
		.pipe(browserify())
		.pipe(gulp.dest(build_dir + '/includes/js'))
		.pipe(notify({ message: 'JS Compiled' }));
});

gulp.task('css', function () {
	return gulp.src(src_dir + '/sass/screen.scss')
		.pipe(sass())
		.pipe(gulp.dest(build_dir + '/includes/css'))
		.pipe(notify({ message: 'SASS Compiled' }));
});

gulp.task('default', ['js', 'css'], function() { 
	livereload.listen();
	
 	gulp.watch(src_dir + '/js/**', ['js']);
 	gulp.watch(src_dir + '/sass/**', ['css']);
	gulp.watch([build_dir + '/**']).on('change', livereload.changed);
});