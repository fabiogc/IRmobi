(function() {
	'use strict';

	angular
	.module('meumobi.services.Bootstrap', ['meumobi.services.Cordova'])
	.factory('BootstrapService', BootstrapService);

	function BootstrapService(deviceReady, $rootScope, UtilsService, CONFIG, LanguageService, ImgCache, meumobiSite, DeviceService) {
		var service = {};

		service.startApp = startApp;
		service.appRate = appRate;

		return service;

		function appRate() {
			try {
				AppRate.preferences.storeAppURL.ios = CONFIG.ITUNES.id;
				AppRate.preferences.storeAppURL.android = 'market://details?id=' + CONFIG.id;
				AppRate.preferences.usesUntilPrompt = 3;
				AppRate.promptForRating();
			} catch (e) {
				console.log(e);
			}
		}

		function startApp() {
			deviceReady(function() {
				UtilsService.spinner.show();
				document.addEventListener("online", $rootScope.toggleCon, false);
				document.addEventListener("offline", $rootScope.toggleCon, false);
				ImgCache.$init();
				UtilsService.statusBar();
				LanguageService.loadLanguage();
				UtilsService.hideSplashScreen();
				UtilsService.initPushwoosh();
				appRate();
			});
		}
	}
})();

