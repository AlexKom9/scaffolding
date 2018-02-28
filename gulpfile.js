let gulp = require('gulp'),
    // server = require('gulp-server-livereload'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    useref = require('gulp-useref'),
    gulpIf = require('gulp-if'),
    csso = require('gulp-csso'),
    uglify = require('gulp-uglifyes'),
    imagemin = require('gulp-imagemin'),
    clean = require('rimraf'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence');

gulp.task("styles", function(){
    gulp.src("./app/sass/**/*.sass")
        .pipe( sass().on('error', sass.logError) )
        .pipe( prefix({
            versions: ['last 20 versions']
        }) )
        .pipe( gulp.dest('./app/css') )
        .pipe(browserSync.stream());
});

gulp.task("images", function(){
    gulp.src("./app/img/**/*")
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5
        }))
        .pipe(gulp.dest("./build/img"))
});

gulp.task("fonts", function(){
    gulp.src("./app/fonts/**/*").pipe(gulp.dest("./build/fonts"));
})

gulp.task("clean", function(cb){
    clean('./build', cb);
});

gulp.task("build-html-js-css", function(){
    gulp.src("./app/index.html")
        .pipe(useref())
        .pipe( gulpIf('*.css', csso()) )
        .pipe( gulpIf('*.js', uglify()) )
        .pipe(gulp.dest('./build'))
});

gulp.task('build', function (callback) {
    runSequence('clean', ['images', 'fonts', 'build-html-js-css'], callback);
});



gulp.task("watch", function(){
    gulp.watch("./app/sass/**/*.sass", ["styles"]);
});

// Static Server + watching scss/html files
gulp.task('serve', ['styles'], function () {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/sass/**/*.sass", ['styles']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});



gulp.task("default", ["serve"]);