"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");
var gcmq = require('gulp-group-css-media-queries');
var mqpacker = require("css-mqpacker");
var sortCSSmq = require('sort-css-media-queries');
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var run = require("run-sequence");
var del = require("del");


gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 versions"
      ]})
    ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("html:copy", function() {
  return gulp.src("*.html")
    .pipe(gulp.dest("build"));
});

gulp.task("html:update", ["html:copy"], function(done) {
  server.reload();
  done();
});


gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html", ["html:update"]);
});

gulp.task("symbols", function(){
  return gulp.src("img/symbols/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg:true
    }))

    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("img"));
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("minsvg", function(){
  return gulp.src("build/img/*.svg")
    .pipe(svgmin())
    .pipe(gulp.dest("build/img"));
});

gulp.task("copy", function() {
  return gulp.src([
      "fonts/**/*.{woff,woff2}",
      "img/**",
      "js/**",
      "*.html"
    ], {
      base: "."
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build", function(fn) {
  run(
    "clean",
    "copy",
    "style",
    "images",
    "minsvg",
    fn
  );
});
