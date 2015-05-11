var gulp = require('gulp');

gulp.task('build', function () {
    gulp.src('src/*.js')
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);
