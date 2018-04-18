let gulp = require('gulp');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let eslint = require('gulp-eslint');

gulp.task('default', () => {
    return gulp.src(['./js/app.js', './js/module.js'])
        .pipe(eslint())
        .pipe(eslint.format()) // To display linting errors
        // .pipe(eslint.failAfterError()) // To stop if any lint error occurs
        .pipe(concat('bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/'));
});
