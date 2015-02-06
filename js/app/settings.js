var meumobiSettings = angular.module('meumobiSettings',[]);

angular.forEach(config_data,function(value, key) {
	meumobiSettings.constant(key, value);
});

meumobiSettings.constant('STOCKS_API', 'http://stocks.' + config_data.SITEBUILDER.replace(/.*?:\/\//g, ""));
meumobiSettings.constant('TIMEOUT', 10000);
meumobiSettings.constant('ITEM_PER_PAGE', 20);

meumobiSettings.factory('interceptor', function($q) {
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
