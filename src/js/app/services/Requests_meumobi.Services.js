(function() {
	'use strict';

	angular
	.module('meumobi.services.Requests', [])
	.factory('httpInterceptor', httpInterceptor);
	
	function httpInterceptor($q, $rootScope) {
		
		var numLoadings = 0;
		
		return {
			request: function(config) {
				numLoadings++;
				
				$rootScope.$broadcast('loading:start');
				return config || $q.when(config)
			},
			response: function(response) {
				if (!(--numLoadings)) {
					// Hide loader
					$rootScope.$broadcast('loading:stop');
				}

				return response || $q.when(response);
			},
			requestError: function(request) {
				if (!(--numLoadings)) {
					// Hide loader
					$rootScope.$broadcast('loading:stop');
				}
				console.log("Interceptor: requestError");
				console.log(request);

				return $q.reject(request);
			},
			responseError: function(response) {
				if (!(--numLoadings)) {
					// Hide loader
					$rootScope.$broadcast('loading:stop');
				}
				console.log("Interceptor: responseError");
				console.log(response);
				
				return $q.reject(response);
			}
		};
	}
})();
