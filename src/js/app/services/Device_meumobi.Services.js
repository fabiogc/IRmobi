(function() {
	'use strict';

	angular
	.module('meumobi.services.Device', [])
	.factory('DeviceService', DeviceService);
		
	function DeviceService() {
		var service = {};
		
		service.isAndroid = isAndroid;
		service.isIOS = isIOS;
		service.platform = platform;
		service.isOnline = isOnline;
 
		return service;

		function isAndroid() {
			return this.platform() == 'Android';
		}

		function isIOS() {
			return this.platform() == 'iOS';
		}

		function platform() {
			return window.device ? window.device.platform : null;
		}

		function isOnline() {
			//TODO
		}
	}
})();
