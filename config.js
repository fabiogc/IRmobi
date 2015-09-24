module.exports = function(config) {

	// Output directory
	config.dest = 'www';
	
	config.version = "1.2.1"; // version of the App
  
	// Inject cordova script into html, automatically set true if call release task
	config.cordova = false;
  
	// Images minification
	config.minify_images = true;

	// Development web server

	config.server.host = '0.0.0.0';
	config.server.port = '8000';
  
	// Set to false to disable it:
	// config.server = false;

	// Weinre Remote debug server
  
	config.weinre.httpPort = 8080;
	config.weinre.boundHost = '192.168.1.173';

	// Comment to enable weinre, uncomment to disable weinre 
	config.weinre = false;
	config.debug = false;
    
	// 3rd party components

	// config.vendor.js.push('./src/js/theme/grid/jquery.grid-a-licious.min.js');
	// config.vendor.fonts.push('.bower_components/font/dist/*');
};
