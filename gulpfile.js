/* jslint node: true */
var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var preprocess = require('gulp-preprocess');

var solutionLoader = require('./loader');

function listSolutions() {
    return [
        solutionLoader(1),
        solutionLoader(2),
        solutionLoader(3),
        solutionLoader(4),
    ];
}

gulp.task('default', ['html', 'css', 'js', 'solutions', 'img']);

gulp.task('css', function () {
    return gulp.src('fe/scss/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css/'));
});

gulp.task('js', function () {
    return gulp.src('fe/js/app.js')
        .pipe(browserify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/js/'));
});

gulp.task('html', function () {
    var solutions = listSolutions();

    solutions.forEach(function (solution) {
        gulp.src('fe/jade/solution.jade')
            .pipe(jade({
                locals: solution,
            }))
            .pipe(concat(solution.id + '.html'))
            .pipe(gulp.dest('public/solutions/html/'));
    });

    return gulp.src('fe/jade/index.jade')
        .pipe(jade({
            locals: {
                problems: solutions,
            }
        }))
        .pipe(gulp.dest('public/'));
});

/**
 * Get all of the solutions available in the solutions/ directory and
 * compile them into public-facing solution scripts in public/solutions/.
 *
 * All solutions are based on the solution.js template, and have the
 * parameter generators and solver dynamically injected at build time.
 */
gulp.task('solutions', function () {
    var solutions = listSolutions();

    solutions.forEach(function (solution) {
        gulp.src('./solution.js')
            .pipe(preprocess({
                context: {
                    SOLUTION_PATH: './' + solution.path,
                },
            }))
            .pipe(browserify())
            .pipe(concat(solution.id + '.js'))
            .pipe(gulp.dest('./public/solutions/js'));
    });
});

gulp.task('img', function() {
    return gulp.src('fe/img/*')
        .pipe(gulp.dest('./public/img'));
});

gulp.task('watch', function () {
    gulp.watch('fe/scss/*.scss', ['css']);
    gulp.watch('fe/js/*.js', ['js']);
    gulp.watch('fe/jade/*.jade', ['html']);
    gulp.watch('fe/jade/partial/*.jade', ['html']);
    gulp.watch('fe/img/*', ['img']);
    gulp.watch('solutions/*.js', ['solutions', 'html']);
});