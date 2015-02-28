'use strict';

var path = require('path');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var webpack = require('webpack');


gulp.task('copy', function() {
  return gulp.src([
    './manifest.json',
    './static/**/*',
    '!./static/ui.js',
    '!./static/sandbox.js'
  ])
  .pipe(gulp.dest('./build/'))
  .on('error', console.log);
});


gulp.task('icons', function () {
  return gulp.src([
      './static/vendor/font-awesome/fonts/**.*',
      './static/vendor/bootstrap/fonts/**.*'
    ])
    .pipe(gulp.dest('static/fonts'))
    .on('error', console.log);
});

gulp.task('staticlibs', function () {
  return gulp.src([
      './node_modules/blockly/**',
    ])
    .pipe(gulp.dest('./static/vendor/blockly'))
    .on('error', console.log);
});

gulp.task('bundle', function(cb) {
  webpack({
    context: path.join(__dirname, './static'),
    entry: {
      ui: './ui',
      sandbox: './sandbox'
    },
    output: {
      path: path.join(__dirname, './build'),
      filename: '[name].js'
    },
    module: {
      loaders: [
        { test: /\.jsx$/, loader: 'jsx-loader?harmony=true' },
        { test: /\.css$/, loader: 'style-loader!css-loader' },
        { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
        { test: /ui\.js$/, loader: "transform?brfs" }
      ]
    },
    plugins: [
      new webpack.IgnorePlugin(/^serialport$/)
    ],
    externals: {
      repl: 'repl'
    }
  }, cb);
});

gulp.task('default', ['icons', 'staticlibs', 'copy', 'bundle']);
