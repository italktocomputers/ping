let gulp = require('gulp');
let browserify = require('gulp-browserify');
let concatCss = require('gulp-concat-css');
let run = require('gulp-run');

let src = './process';
let app = './app';

gulp.task('js', () => {
    gulp.src(
        src + '/js/*.js'
    ).pipe(
        browserify({
            transform: 'reactify',
            extensions: 'browserify-css',
            debug: true
        })
    ).on('error', (error) => {
        console.error(error.message);
    }).pipe(
        gulp.dest(app + '/js')
    )
});

gulp.task('css', () => {
    gulp.src(
        src + '/css/*.css'
    ).pipe(
        concatCss('app.css')
    ).pipe(
        gulp.dest(app + '/css')
    )
});

gulp.task('serve', ['css', 'js'], () => {
    run('electron app/main.js').exec();
});

gulp.task('default', ['serve']);