cat css/bootstrap.css css/font-awesome.min.css css/font.css \
  css/style.css css/plugin.css css/custom.css  css/blueimp-gallery.min.css > css/combined.css
yui-compressor --nomunge css/combined.css -o css/rimobi.min.css
#uglifyjs js/combined.js -o js/rimobi-min.js -c
rm css/combined.css
