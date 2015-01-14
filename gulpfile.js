var config = {
  language: 'pt'
}

if (require('fs').existsSync('./config.js')) {
    var configFn = require('./config');
      configFn(config);
};

var gulp           = require('gulp'),
    rename         = require('gulp-rename'),
    download       = require("gulp-download")
    git            = require('gulp-git'),
    minimist       = require('minimist'),
    path           = require('path');

//get cli parameters
config = minimist(process.argv.slice(2), config)

gulp.task('html', function() {
  return download(config.url)
    .pipe(gulp.dest(config.language + "/main.html"));
});
