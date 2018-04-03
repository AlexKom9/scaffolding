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
		runSequence = require('run-sequence'),
		rigger = require('gulp-rigger'),
		plumber = require('gulp-plumber');
// var fileinclude = require('gulp-file-include');
// gulp.task('fileinclude', function() {
//   gulp.src(['./app/index.html'])
//     .pipe(fileinclude({
//       prefix: '@@',
//       basepath: '@file'
//     }))
//     .pipe(gulp.dest('./app'));
// });

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
			gulp.src("./app/img/**/*.*")
				.pipe(plumber())
				.pipe(imagemin({
						interlaced: true,
						progressive: true,
						optimizationLevel: 5,
						svgoPlugins: [{removeViewBox: false}]
				}))
				.pipe(gulp.dest("./build/img"))
});

gulp.task("fonts", function(){
		gulp.src("./app/fonts/**/*").pipe(gulp.dest("./build/fonts"));
})

gulp.task("libs", function(){
		gulp.src("./app/libs/**/*").pipe(gulp.dest("./build/libs"));
})

gulp.task("clean", function(cb){
		clean('./build', cb);
});

gulp.task("clean-gitPage", function(cb){
		clean('d:/WorkShop/GitHubPages/peiko/', cb);
});



gulp.task("build-html-js-css", function(){
		gulp.src("./app/*.html")
				.pipe(useref())
				.pipe( gulpIf('*.css', csso()) )
				.pipe( gulpIf('*.js', uglify()) )
				.pipe(gulp.dest('./build'))
});

gulp.task('build', function (callback) {
		runSequence('clean', 'images', 'fonts', 'build-html-js-css','libs', callback);
});

gulp.task("trasfer-to-gitPage", function(){
	gulp.src("./build/**/*")
		.pipe(gulp.dest('d:/WorkShop/GitHubPages/peiko/'))
});

gulp.task('to-gitPage', function (callback) {
		runSequence('clean-gitPage', ['trasfer-to-gitPage'], callback);
});



gulp.task("watch", function(){
		gulp.watch("./app/sass/**/*.sass", ["styles"]);
});


gulp.task("assemble-html", function(){
	gulp.src("./app/html/index.html")
	.pipe(rigger());
	// .pipe(gulp.dest('./app'));
	// gulp.src("./app/html/main.html")
	// .pipe(rigger())
	// .pipe(gulp.dest('./app'));
	// gulp.src("./app/html/about_us.html")
	// .pipe(rigger())
	// .pipe(gulp.dest('./app'));
	// gulp.src("./app/html/cases.html")
	// .pipe(rigger())
	// .pipe(gulp.dest('./app'));
	// gulp.src("./app/html/separate_case.html")
	// .pipe(rigger())
	// .pipe(gulp.dest('./app'));
	// gulp.src("./app/html/separate_job.html")
	// .pipe(rigger())
	// .pipe(gulp.dest('./app'));
})

// Static Server + watching scss/html files
gulp.task('serve', ['styles'], function () {
		browserSync.init({
				server: "./app"
		});
		gulp.watch("app/html/**/*.html",["assemble-html"]);
		gulp.watch("app/sass/**/*.sass", ['styles']);
		// gulp.watch("app/modules/**/*.html", ['fileinclude']);
		gulp.watch("app/*.html").on('change', browserSync.reload);
});



gulp.task("default", ["serve"]);
