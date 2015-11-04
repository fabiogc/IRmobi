var config = {
	version: "1.0.0",
	debug: false,
	dest: 'www',
	cordova: false,
	minify_images: true,
	vendor: {
		js: [
			//'./bower_components/jquery/dist/jquery.min.js',
			'./bower_components/jquery-1.11.3/index.js',
			'./bower_components/bootstrap/dist/js/bootstrap.min.js',
			'./bower_components/angular/angular.js',
			'./bower_components/ng-file-upload-shim/ng-file-upload.min.js',
			'./bower_components/angular-route/angular-route.min.js',
			'./bower_components/angular-touch/angular-touch.min.js',
			'./bower_components/angular-sanitize/angular-sanitize.min.js',
			'./bower_components/angular-cookies/angular-cookies.min.js',
			'./bower_components/angular-resource/angular-resource.min.js',
			'./bower_components/angulartics/dist/angulartics.min.js',
			// Should use angulartics-ga-cordova and load module angulartics.google.analytics.cordova if run on App
			'./bower_components/angulartics/dist/angulartics-ga-cordova.min.js',
			'./bower_components/angular-translate/angular-translate.min.js',
			'./bower_components/angular-media-player/dist/angular-media-player.min.js',
			'./bower_components/angular-locale-pt-br/angular-locale_pt-br.js',
			'./bower_components/ng-fastclick/dist/index.min.js',
			'./bower_components/angular-imgcache/angular-imgcache.js',
			'./bower_components/imgcache.js/js/imgcache.js',

      //'./src/js/lib/angular-file-upload.min.js',
      //'./src/js/lib/angularLocalStorage.js',

			//'./bower_components/angular-local-storage/dist/angular-local-storage.min.js',
			'./src/js/lib/truncate.js',
			'./src/js/lib/md5.min.js',
			'./src/js/lib/angular-pushwoosh.js',
			'./src/js/lib/angular-adtech.js',
			'./src/js/lib/http-with-fallback.js',
			'./src/js/lib/angular-meumobi.js',
			'./src/js/lib/angular-slugify.js',
			'./src/js/lib/angular-calendar.js',
			'./src/js/phonegap/utils/Calendar.js',
			'./src/js/ie/excanvas.js',
			'./src/js/ie/html5.js',
			'./src/js/ie/respond.min.js'
			//'./src/js/lib/analytics.js'
		],
		css: [
			'./bower_components/bootstrap/dist/css/bootstrap.min.css',
			'./bower_components/font-awesome/css/font-awesome.min.css'
		],
		fonts: [
			'./bower_components/font-awesome/fonts/fontawesome-webfont.*'
		]
	},
	server: {
		host: '0.0.0.0',
		port: '8000'
	},

	weinre: {
		httpPort: 8001,
		boundHost: 'localhost',
		verbose: false,
		debug: false,
		readTimeout: 5,
		deathTimeout: 15
	}
};

/*-----  End of Configuration  ------*/


/*========================================
=            Requiring stuffs            =
========================================*/

var gulp = require('gulp'),
seq = require('run-sequence'),
connect = require('gulp-connect'),
less = require('gulp-less'),
uglify = require('gulp-uglify'),
sourcemaps = require('gulp-sourcemaps'),
cssmin = require('gulp-cssmin'),
order = require('gulp-order'),
concat = require('gulp-concat'),
rimraf = require('gulp-rimraf'),
imagemin = require('gulp-imagemin'),
pngcrush = require('imagemin-pngcrush'),
templateCache = require('gulp-angular-templatecache'),
mobilizer = require('gulp-mobilizer'),
ngAnnotate = require('gulp-ng-annotate'),
replace = require('gulp-replace'),
ngFilesort = require('gulp-angular-filesort'),
streamqueue = require('streamqueue'),
rename = require('gulp-rename'),
path = require('path');
args = require('yargs').argv;
fs = require('fs');
gulpif = require('gulp-if');
zip = require('gulp-zip');
request = require('request'); // https://github.com/request/request
preprocess = require('gulp-preprocess');

if (fs.existsSync('./config.js')) {
	var configFn = require('./config');
	configFn(config);
};

// Get the project from the command line
var project = args.project || 'santander';

// Get the environment from the command line
var env = args.env || 'integration';
var cwd = './PROJECTS/' + project;

// Read the Environment & App Settings
var filename = env + '.json';
var configEnv = JSON.parse(fs.readFileSync(path.join(cwd, 'environments', filename), 'utf8'));
var configProject = JSON.parse(fs.readFileSync(path.join(cwd,'config.json'), 'utf8'));

console.log(
	"==== Gulp IRmobi: Project="
	+ configProject.name
	+ config.version
	+ ", Environment="
	+ env
);

if (config.debug) {
	console.log("/!\\ === Be careful It's a debug release === /!\\ ");
	console.log("Set config.debug = false on gulpfile.js to submit");
}

/*================================================
=                  Copy App Assets               =
================================================*/

// Copy APP Assets, maintaining the original directory structure
gulp.task('copy', function () {
	return gulp.src('./res/**/*', {
		cwd: cwd
	})
	.pipe(gulp.dest(path.join(config.dest, 'res')))
});

// .pgbomit signifies to PhoneGap Build that it SHOULD NOT include the contents of that directory in the app package
// http://phonegap.com/blog/2014/04/11/phonegap-build-adds-some-new-features
gulp.task('pgbomit', ['copy'], function (){
	fs.writeFileSync(path.join(config.dest, 'res') + "/.pgbomit", '');
}); 

// Copy Default APP icon on root
gulp.task('copy-icon', function () {
	return gulp.src('./res/icon/ios/AppIcon.appiconset/Icon-60@2x.png', {
		cwd: cwd
	})
	.pipe(rename('icon.png'))
	.pipe(gulp.dest(config.dest))
});

// Copy Default APP splash on root
gulp.task('copy-splash', function () {
	return gulp.src('./res/screen/ios/Default.png', {
		cwd: cwd
	})
	.pipe(rename('splash.png'))
	.pipe(gulp.dest(config.dest))
});

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
		path.join(config.dest, 'fonts'),
		path.join(config.dest, 'res'),
		path.join(config.dest, 'icon.png'),
		path.join(config.dest, 'splash.png'),
		path.join(config.dest, 'config.xml'),
		path.join(config.dest, 'locales'),
		
		path.join(config.dest, 'error'),
		path.join(config.dest, 'index'),
		path.join(config.dest, 'partials'),
		path.join(config.dest, 'templates_c')
	], {
		read: false
	})
	.pipe(rimraf());
});


/*==========================================
=            Start a web server            =
==========================================*/

gulp.task('connect', function() {
	if (typeof config.server === 'object') {
		connect.server({
			root: config.dest,
			host: config.server.host,
			port: config.server.port,
			livereload: true
		});
	} else {
		throw new Error('Connect is not configured');
	}
});


/*==============================================================
=            Setup live reloading on source changes            =
==============================================================*/

gulp.task('livereload', function() {
	gulp.src(path.join(config.dest, '*.html'))
	.pipe(connect.reload());
});

/*=====================================
=            Minify & Copy images            =
=====================================*/

gulp.task('images', function() {
	var streamBuildAction = streamqueue({
		objectMode: true
	},
	gulp.src('src/images/**/*'),
	gulp.src('./images/**/*', {cwd: cwd})
);
return streamBuildAction
.pipe(gulpif(config.minify_images, imagemin({
	progressive: true,
	svgoPlugins: [{
		removeViewBox: false
	}],
	use: [pngcrush()]
})))
.pipe(gulp.dest(path.join(config.dest, 'images')));
});


/*==================================
=            Copy fonts            =
==================================*/

gulp.task('fonts', function() {
  return streamqueue({
      objectMode: true
    },
    gulp.src(config.vendor.fonts),
    gulp.src('./src/fonts/**/*')
  )
	.pipe(gulp.dest(path.join(config.dest, 'fonts')));
});

/*=================================================
=            Copy html files to dest              =
=================================================*/

gulp.task('html', function() {
	var inject = [];
	if (typeof config.weinre === 'object' && config.debug) {
		inject.push('<script src="http://' + config.weinre.boundHost + ':' + config.weinre.httpPort + '/target/target-script-min.js"></script>');
	}
	if (config.cordova) {
		inject.push('<script src="cordova.js"></script>');
	}
	/*if (configProject.STYLE.webputty && config.debug) {
		inject.push('<link href="' + configProject.STYLE.webputty + '" rel="stylesheet" type="text/css" />');
	}*/
	return gulp.src(['src/html/**/*.html'])
	.pipe(replace('<!-- inject:js -->', inject.join('\n    ')))
	.pipe(replace('@@name', configProject.name))
	.pipe(preprocess({context: { PROJECT_NAME: configProject.name}}))
	.pipe(gulp.dest(config.dest));
});


/*===========================================
=            Copy Smarty tpl files           =
=============================================*/

gulp.task('tpl', function() {
  return gulp.src('src/tpl/**/*')
    .pipe(gulp.dest(config.dest));
});


/*======================================================================
=            Compile, minify css                                       =
======================================================================*/

gulp.task('css', ['webputty'], function() {
//gulp.task('css', function() {
  return streamqueue({
      objectMode: true
    },
    gulp.src(config.vendor.css),
    gulp.src([
			'./src/css/**/*.css',
			'!./src/css/landing.css'
		]),
		gulp.src('./css/**/*', {cwd: cwd})
		//gulpif(config.debug, gulp.src('!./css/webputty.css', {cwd: cwd}))
  )
  .pipe(concat('app.css'))
  .pipe(cssmin())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest(path.join(config.dest, 'css')));
});


gulp.task('webputty', function() {
	if (configProject.STYLE.webputty) {
		return request
			.get(configProject.STYLE.webputty)
			.on('error', function (err) {
				throw new Error(err)
			})
			.pipe(fs.createWriteStream(cwd + "/css/webputty.css"));
	}
});

/*====================================================================
=                     Update and Copy config.xml                     =
====================================================================*/

gulp.task('phonegap-config', function() {
	return gulp.src('src/config.xml')
	.pipe(replace('@@id', configProject.id))
	.pipe(replace('@@version', config.version))
	.pipe(replace('@@name', configProject.name))
	.pipe(replace('@@description', configProject.description))
	.pipe(gulp.dest(config.dest));
});

/*====================================================================
=                     Copy locales                     =
====================================================================*/

gulp.task('locales', function() {
	return gulp.src('src/locales/**/*')
	.pipe(gulp.dest(path.join(config.dest, 'locales')));
});

/*====================================================================
=               Build Zip to submit to PhoneGap Build                =
====================================================================*/

gulp.task('build-zip', ['copy', 'pgbomit', 'copy-icon', 'copy-splash'], function () {
	var filename = project + "-" + env +"_rel-" + config.version + ".zip";
	return gulp.src('www/**/*')
		.pipe(zip(filename))
		.pipe(gulp.dest('dist'));
});


/*====================================================================
=            Compile and minify js generating source maps            =
====================================================================*/
// - Orders ng deps automatically
// - Precompile templates to ng templateCache


gulp.task('js', function() {
	var app = configEnv.APP;
	var streamBuildAction = streamqueue({
		objectMode: true
	},
	gulp.src(config.vendor.js),
	gulp.src('src/js/app/services/Settings_meumobi.Services.js')  
	.pipe(replace('@@APP', JSON.stringify(app)))
	.pipe(replace('@@CONFIG', JSON.stringify(configProject))),
	gulp.src('src/js/lib/pushwoosh-*.js')
	.pipe(replace('@@googleProjectNumber', configProject.PUSHWOOSH.googleProjectNumber))
	.pipe(replace('@@applicationCode', configProject.PUSHWOOSH.applicationCode)),
	gulp.src([
		'./src/js/theme/grid/jquery.grid-a-licious.min.js',
		'./src/js/theme/jquery.blueimp-gallery.min.js',
		'./src/js/theme/app.js',
		'./src/js/theme/app.plugin.js',
		'./src/js/theme/app.data.js',
		'./src/js/theme/custom.js',
		'./src/js/app/**/*.js',
		'!./src/js/app/services/Settings_meumobi.Services.js',
		'!./src/js/lib/pushwoosh-*.js'

	])
	.pipe(replace('@@debug', config.debug))
	.pipe(ngFilesort()),
	gulp.src(['src/templates/**/*.html'])
	.pipe(replace('@@name', configProject.name))
	.pipe(templateCache({
			module: 'meumobiApp'
		}))
	);
	return streamBuildAction
	.pipe(sourcemaps.init())
	.pipe(concat('app.js'))
	.pipe(ngAnnotate())
	.pipe(gulpif(!config.debug, uglify({ mangle: false })))
	.pipe(rename({suffix: '.min'}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(path.join(config.dest, 'js')));
});


/*===================================================================
=            Watch for source changes and rebuild/reload            =
===================================================================*/

gulp.task('watch', function() {
	if (typeof config.server === 'object') {
		gulp.watch([config.dest + '/**/*'], ['livereload']);
	};
	gulp.watch(['./src/html/**/*'], ['html']);
	gulp.watch(['./src/less/**/*'], ['less']);
	gulp.watch(['./src/js/**/*', './src/templates/**/*', config.vendor.js], ['js']);
	gulp.watch(['./src/images/**/*'], ['images']);
});


/*===================================================
=            Starts a Weinre Server                 =
===================================================*/

gulp.task('weinre', function() {
	if (typeof config.weinre === 'object') {
		var weinre = require('./node_modules/weinre/lib/weinre');
		weinre.run(config.weinre);
	} else {
		throw new Error('Weinre is not configured');
	}
});


/*======================================
=            Build Sequence            =
======================================*/
// phonegap-config allows to use phonegap CLI $ phonegap serve

gulp.task('build', function(done) {
	var tasks = ['html', 'fonts', 'images', 'css', 'js', 'locales', 'phonegap-config'];
	seq('clean', tasks, done);
});


/*====================================
=            Default Task            =
====================================*/

gulp.task('default', function(done) {
	var tasks = [];

	if (typeof config.weinre === 'object') {
		tasks.push('weinre');
	};

	if (typeof config.server === 'object') {
		tasks.push('connect');
	};

	tasks.push('watch');

	seq('build', tasks, done);
});

/*================================================================
=            Release Task to submit to PhoneGap Build            =
================================================================*/

gulp.task('release', function(done) {
	var tasks = [];

	if (typeof config.weinre === 'object' && config.debug) {
		tasks.push('weinre');
	};
	config.cordova = true;
	tasks.push('build-zip');

	seq('build', tasks, done);
});