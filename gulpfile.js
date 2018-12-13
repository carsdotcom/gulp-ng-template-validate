var gulp = require('gulp');
var clean = require('gulp-rimraf');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');

gulp.task('clean', function () {
    return gulp.src('dist/', { read: false }).pipe(clean());
});

gulp.task('lint', function () {
    return gulp.src(['src/*.js', 'test/*.js']).pipe(eslint()).pipe(eslint.format());
});

gulp.task('build', function () {
    return gulp.src('src/*.js').pipe(gulp.dest('dist'));
});

gulp.task('test', function () {
    return gulp.src('test/*.js', { read: false }).pipe(mocha());
});

gulp.task('default', gulp.series('clean', 'lint', 'build', 'test'));
