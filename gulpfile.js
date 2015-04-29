var config = {
  dest: 'www',
  vendor: {
    js: [
      './bower_components/jquery/dist/jquery.js',
      './bower_components/bootstrap/js/bootstrap.js',
      './src/js/lib/angular-file-upload-shim.min.js',
      './bower_components/angular/angular.js',
      './bower_components/angular-route/angular-route.js',
      './bower_components/angular-touch/angular-touch.js',
      './bower_components/angular-sanitize/angular-sanitize.js',
      './bower_components/angular-cookies/angular-cookies.js',
      './bower_components/angular-resource/angular-resource.js',
      
      './bower_components/angulartics/src/angulartics.js',
      './bower_components/angulartics/src/angulartics-ga.js',
      './bower_components/angular-translate/angular-translate.js',
      
      './src/js/lib/angular-file-upload.min.js',
      './src/js/lib/angularLocalStorage.js',
      './src/js/lib/http-with-fallback.js',
      './src/js/lib/angular-slugify.js',
      './src/js/lib/angular-calendar.js',
      './src/js/lib/truncate.js',
      './src/js/lib/md5.min.js',
      './src/js/lib/angular-pushwoosh.js',
      './src/js/lib/angular-adtech.js',
      './src/js/lib/angular-media-player.min.js'
    ],
    css: [
      './bower_components/bootstrap/dist/css/bootstrap.css',
      './bower_components/font-awesome/css/font-awesome.css'
    ],
    fonts: [
      './bower_components/font-awesome/fonts/fontawesome-webfont.*'
    ]
  }
};

var gulp = require('gulp'),
    seq = require('run-sequence'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-cssmin'),
    order = require('gulp-order'),
    concat = require('gulp-concat'),
    ignore = require('gulp-ignore'),
    rimraf = require('gulp-rimraf'),
    templateCache = require('gulp-angular-templatecache'),
    replace = require('gulp-replace'),
    ngFilesort = require('gulp-angular-filesort'),
    streamqueue = require('streamqueue'),
    rename = require('gulp-rename'),
    path = require('path');

/*================================================
=            Report Errors to Console            =
================================================*/

gulp.on('err', function(e) {
  console.log(e.err.stack);
});


/*=========================================
=            Clean dest folder            =
=========================================*/

gulp.task('clean', function(cb) {
  return gulp.src([
      path.join(config.dest, 'index.html'),
      path.join(config.dest, 'images'),
      path.join(config.dest, 'css'),
      path.join(config.dest, 'js'),
      path.join(config.dest, 'fonts')
    ], {
      read: false
    })
    .pipe(rimraf());
});


/*==================================
=            Copy fonts            =
==================================*/

gulp.task('fonts', function() {
  return gulp.src(config.vendor.fonts)
    .pipe(gulp.dest(path.join(config.dest, 'fonts')));
});

/*==================================
=            Copy images           =
==================================*/

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest(path.join(config.dest, 'images')));
});

/*==================================
=            Copy Smarty tpl files           =
==================================*/

gulp.task('tpl', function() {
  return gulp.src('src/tpl/**/*')
    .pipe(gulp.dest(config.dest));
});


/*=================================================
=            Copy html files to dest              =
=================================================*/

gulp.task('html', function() {
  var inject = [];
  if (typeof config.weinre === 'object') {
    inject.push('<script src="http://' + config.weinre.boundHost + ':' + config.weinre.httpPort + '/target/target-script-min.js"></script>');
  }
  if (config.cordova) {
    inject.push('<script src="cordova.js"></script>');
  }
  gulp.src(['src/html/**/*.html'])
    .pipe(replace('<!-- inject:js -->', inject.join('\n    ')))
    .pipe(gulp.dest(config.dest));
});


/*======================================================================
=            Compile, minify css                                       =
======================================================================*/

gulp.task('css', function() {
    streamqueue({
        objectMode: true
      },
      gulp.src(config.vendor.css),
      gulp.src('./src/css/**/*.css')
    )
    .pipe(concat('app.css'))
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(path.join(config.dest, 'css')));
});

/*====================================================================
=            Compile and minify js generating source maps            =
====================================================================*/
// - Orders ng deps automatically
// - Precompile templates to ng templateCache

gulp.task('js', function() {
  streamqueue({
        objectMode: true
      },
      gulp.src(config.vendor.js),
      gulp.src('./src/js/app/**/*.js').pipe(ngFilesort()),
      gulp.src('./src/js/theme/**/*.js').pipe(ngFilesort())
    )
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    //.pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(path.join(config.dest, 'js')));
});

gulp.task('build', function(done) {
  var tasks = ['html', 'tpl', 'images', 'fonts', 'css', 'js'];
  seq('clean', tasks, done);
});

/*====================================
=            Default Task            =
====================================*/

gulp.task('default', function(done) {
  var tasks = [];

  seq('build', done);
});
