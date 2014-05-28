var meumobiSettings = angular.module('meumobiSettings',[]);
config_data.SITE_BUILDER_URL = uncrypt(config_data.SITE_BUILDER_URL_ENCRYPTED);
config_data.STOCKS_URL = 'http://stocks.'+ config_data.SITE_BUILDER_URL.replace(/.*?:\/\//g, "");

angular.forEach(config_data,function(value, key) {
	meumobiSettings.constant(key, value);
});

meumobiSettings.constant('TIMEOUT', 10000);
meumobiSettings.constant('ITEM_PER_PAGE', 20);

meumobiSettings.factory('utils', ['$location', 'SITE_BUILDER_URL', 'DOMAIN',
		function($location, SITE_BUILDER_URL, DOMAIN){
			var utils = {};
			utils.getApiUrl = function() {
				if (typeof DOMAIN != 'undefined') {
					return SITE_BUILDER_URL + '/api/' + DOMAIN;
				}
				return SITE_BUILDER_URL + '/api/' + $location.host();
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
		return $q.reject(rejection);
	}
	};
});
var gaPlugin = null;
