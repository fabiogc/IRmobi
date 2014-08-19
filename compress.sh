cat js/lib/angular-file-upload-shim.min.js js/lib/angular/angular.min.js js/lib/angular/angular-route.min.js \
  js/lib/angular/angular-sanitize.min.js js/lib/angular/angular-cookies.min.js js/lib/angular/angular-touch.min.js \
  js/lib/angular/angular-resource.min.js \
  js/lib/angular-file-upload.min.js js/lib/angularLocalStorage.js js/lib/angular-translate.min.js \
  js/lib/angular-translate-handler-log.min.js	js/lib/angular-slugify.js js/lib/truncate.js \
  js/lib/angulartics.js js/lib/angulartics-ga.js \
	js/lib/angular-media-player.min.js \
  # if satander
  #js/lib/aes.js js/lib/md5.js js/santander_config.js \
	js/app/helpers.js js/app/services.js js/app/controllers.js js/app/directives.js js/app/settings.js \
	js/app/bootstrap.js js/bootstrap.js js/parsley/parsley.min.js \
	js/jquery.blueimp-gallery.min.js js/app.js js/app.plugin.js \
	js/app.data.js js/custom.js > js/combined.js
yui-compressor --nomunge js/combined.js -o js/rimobi.min.js
#uglifyjs js/combined.js -o js/rimobi-min.js -c
rm js/combined.js
