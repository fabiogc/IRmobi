var meumobiSettings = angular.module('meumobiSettings',[]);
config_data.API_URL = uncrypt(config_data.SITE_BUILDER_URL_ENCRYPTED);
config_data.SERVICES_URL = 'http://stocks.'+ config_data.API_URL.replace(/.*?:\/\//g, "");
console.log(config_data.SERVICES_URL);
angular.forEach(config_data,function(value, key) {
	meumobiSettings.constant(key, value);
});

meumobiSettings.constant('TIMEOUT', 10000);
meumobiSettings.constant('ITEM_PER_PAGE', 20);

meumobiSettings.factory('utils', ['$location', 'API_URL', 'DOMAIN',
		function($location, API_URL, DOMAIN){
			var utils = {};
			utils.getApiUrl = function() {
				if (typeof DOMAIN != 'undefined') {
					return API_URL + '/api/' + DOMAIN;
				}
				return API_URL + '/api/' + $location.host();
			};
			return utils;
		}]);

meumobiSettings.factory('errorHttpInterceptor', function($q) {
	return {
	'requestError': function(rejection) {
		// do something on error
		console.log(rejection);
		return $q.reject(rejection);
	},
	'responseError': function(rejection) {
		// do something on error
		console.log(rejection);
		return $q.reject(rejection);
	}
	};
});
var gaPlugin = null;
