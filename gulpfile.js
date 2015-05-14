var gulp = require('gulp');
var sequence = require('run-sequence');
var del = require('del');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');

gulp.task('clean', function () {
    del([
        'dist/**/*'
    ]);
});

gulp.task('lint', function () {
    return gulp.src([
                    'src/*.js',
                    'test/*.js'
                ])
                .pipe(eslint())
                .pipe(eslint.format());
});

gulp.task('build', function () {
    gulp.src('src/*.js')
        .pipe(gulp.dest('dist'));
});

gulp.task('test', function () {
    gulp.src('test/*.js', { read: false })
        .pipe(mocha());
});

gulp.task('default', sequence('clean', 'lint', 'build', 'test'));
