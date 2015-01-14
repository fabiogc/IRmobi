var config = {
  language: 'pt'
}

if (require('fs').existsSync('./config.js')) {
    var configFn = require('./config');
      configFn(config);
};

var gulp           = require('gulp'),
    download       = require("gulp-download")
    git            = require('gulp-git'),
    minimist       = require('minimist'),
    del            = require('del'),
    path           = require('path');

//get cli parameters
config = minimist(process.argv.slice(2), config)

gulp.task('html', function() {
  return download('http://santander.int-meumobi.com')
    .pipe(gulp.dest("pt/main.html"));
});

gulp.task('clean', function(cb) {
    del(['pt/main.html'], cb)
});

gulp.task('default', ['clean'], function() {
    gulp.start('html');
});
