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

if (fs.existsSync('config.json')) {
 extend(config, require('config.json'));
};

//get cli parameters
config = minimist(process.argv.slice(2), config)

gulp.task('html', function() {
  return request('http://santander.int-meumobi.com')
    .pipe(fs.createWriteStream("pt/main.html"));
});

gulp.task('clean', function(cb) {
    del(['pt/main.html'], cb)
});

gulp.task('default', ['clean'], function() {
    gulp.start('html');
});
