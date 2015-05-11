var gulp = require('gulp');
var sequence = require('run-sequence');
var del = require('del');

gulp.task('clean', function () {
    del([
        'dist/**/*'
    ]);
});

gulp.task('build', function () {
    gulp.src('src/*.js')
        .pipe(gulp.dest('dist'));
});

gulp.task('default', sequence('clean', 'build'));
