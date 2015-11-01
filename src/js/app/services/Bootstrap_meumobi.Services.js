(function() {
	'use strict';

	angular
	.module('meumobi.services.Bootstrap', ['meumobi.services.Cordova'])
	.factory('BootstrapService', BootstrapService);

	function BootstrapService(deviceReady, $rootScope, UtilsService, CONFIG, LanguageService, ImgCache, meumobiSite) {
		var service = {};

		service.startApp = startApp;
		service.appRate = appRate;

		return service;

		function getImage(path){
			/*
			if(localStorage["image_"+id]){
			return localStorage["image_"+id];
			}
			*/
			return APP.cdnUrl + path;
		}

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
				ImgCache.$init();
				UtilsService.statusBar();
				UtilsService.initPushwoosh();
				appRate();
				LanguageService.loadLanguage();
				UtilsService.hideSplashScreen();
			});
		}
	}
})();

