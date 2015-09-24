(function() {
	'use strict';

	angular
	.module('meumobi.services.Bootstrap', ['meumobi.services.Cordova'])
	.factory('BootstrapService', BootstrapService);

	function BootstrapService(deviceReady, $rootScope, UtilsService) {
		var service = {};

		service.startApp = startApp;

		return service;

		function getImage(path){
			/*
			if(localStorage["image_"+id]){
			return localStorage["image_"+id];
			}
			*/
			return APP.cdnUrl + path;
		}

		function startApp() {
			deviceReady(function() {
				UtilsService.hideSplashScreen();
				UtilsService.statusBar();
			});
		}
	}
})();

