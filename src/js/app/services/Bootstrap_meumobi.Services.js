(function() {
	'use strict';

	angular
	.module('meumobi.services.Bootstrap', ['meumobi.services.Cordova'])
	.factory('BootstrapService', BootstrapService);

	function BootstrapService(deviceReady, $rootScope, UtilsService, CONFIG) {
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
			AppRate.preferences.storeAppURL.ios = CONFIG.IDS.apple;
			AppRate.preferences.storeAppURL.android = 'market://details?id=' + CONFIG.IDS.google;
			AppRate.preferences.usesUntilPrompt = 3;
		}

		function startApp() {
			deviceReady(function() {
				UtilsService.hideSplashScreen();
				UtilsService.statusBar();
				UtilsService.initPushwoosh();
				appRate();
			});
		}
	}
})();

