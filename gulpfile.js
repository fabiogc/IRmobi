var config = {
  language: 'pt',
  build: [
    'js/' 
  ]
};

var gulp           = require('gulp'),
    request        = require("request"),
    fs             = require('fs'), 
    minimist       = require('minimist'),
    extend         = require('util')._extend,
    del            = require('del'),
    zip            = require('gulp-zip'),
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

/*gulp.task('compress', function() {
  console.log(process.cwd());
  //TODO remove unnecessary files
  return gulp.src('pt/*', {cwd: process.cwd()})
        .pipe(zip('pt.zip'));
});*/

gulp.task('clean_app', function(cb) {
  del([config.language + '/main.html'], cb)
});

gulp.task('build', ['clean_app'], function() {
  gulp.start('html');
});
