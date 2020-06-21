const gulp = require('gulp');
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");
const browserSync = require("browser-sync").create();
const clean = require("gulp-clean");

// Copy assets
gulp.task("copy",() => {
  return gulp
    .src("./src/**/**/*")
    .pipe(gulp.dest("./docs/"));
});

// Minify CSS
gulp.task("minify:css",() => {
  return gulp
    .src("./src/assets/css/*.css", "!./src/assets/css/*.min.css")
    .pipe(cleanCSS())
    .pipe(gulp.dest("./docs/assets/css"))
    .pipe(browserSync.stream());
});

// Minify JS
gulp.task("minify:js",() => {
  return gulp
    .src(["./src/assets/js/*.js", "!./src/assets/js/*.min.js"])
    .pipe(uglify())
    .pipe(gulp.dest("./docs/assets/js"))
    .pipe(browserSync.stream());
});

// Minify HTML
gulp.task("minify:html",() => {
  return gulp
    .src("./src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./docs/"))
    .pipe(browserSync.stream());
});

gulp.task("minify", gulp.series("minify:css","minify:js","minify:html"));

// Clean public
gulp.task("clean", function() {
  return gulp
    .src("docs", { read: false })
    .pipe(clean());
});

// Dev task
gulp.task("serve",() => {
  browserSync.init({
    server: {
      baseDir: "./docs/"
    },
    port: "8080"
  });

  gulp.watch("./src/assets/css/*.css", gulp.series("minify:css"));
  gulp.watch("./src/assets/js/*.js", gulp.series("minify:js"));
  gulp.watch("./src/*.html", gulp.series("minify:html"));

});

// build task
gulp.task("build", gulp.series("copy","minify"));

// default task
gulp.task("default", gulp.series("build","serve"));
