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
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin")

gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 versions"
      ]}),
      mqpacker({
        sort:true
      })
    ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html").on("change", server.reload);
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
  return gulp.src("img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("img"));
});

gulp.task("minsvg", function(){
  return gulp.src("img/*.svg")
    .pipe(svgmin())
    .pipe(gulp.dest("img"));
});
