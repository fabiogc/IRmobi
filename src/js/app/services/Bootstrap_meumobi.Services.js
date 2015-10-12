(function() {
	'use strict';

	angular
	.module('meumobi.services.Bootstrap', ['meumobi.services.Cordova'])
	.factory('BootstrapService', BootstrapService);

	function BootstrapService(deviceReady, $rootScope, UtilsService, CONFIG, LanguageService) {
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
			} catch (e) {
				console.log(e);
			}
		}

		function startApp() {
			deviceReady(function() {
				UtilsService.hideSplashScreen();
				UtilsService.statusBar();
				UtilsService.initPushwoosh();
				appRate();
				LanguageService.loadLanguage();
			});
		}
	}
})();

