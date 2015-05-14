var gulp = require('gulp');
var sequence = require('run-sequence');
var del = require('del');
var mocha = require('gulp-mocha');

gulp.task('clean', function () {
    del([
        'dist/**/*'
    ]);
});

gulp.task('build', function () {
    gulp.src('src/*.js')
        .pipe(gulp.dest('dist'));
});

gulp.task('test', function () {
    gulp.src('test/*.js', { read: false })
        .pipe(mocha());
});

gulp.task('default', sequence('clean', 'build'));
