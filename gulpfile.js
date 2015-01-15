var config = {
  language: 'pt'
}

var gulp           = require('gulp'),
    request        = require("request"),
    fs             = require('fs'), 
    git            = require('gulp-git'),
    minimist       = require('minimist'),
    extend         = require('util')._extend,
    del            = require('del'),
    path           = require('path');

//TODO fix symlink bug
/*if (fs.existsSync('./config.json')) {
  var cf = require('./config.json');
  extend(config, cf);
};*/
//get cli parameters
extend(config, minimist(process.argv.slice(2)));

gulp.task('html', function() {
  return request(config.url)
    .pipe(fs.createWriteStream(config.language + "/main.html"));
});

gulp.task('clean', function(cb) {
    del([config.language + '/main.html'], cb)
});

gulp.task('default', ['clean'], function() {
    gulp.start('html');
});
