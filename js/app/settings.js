var meumobiSettings = angular.module('meumobiSettings',[]);
angular.forEach(config_data,function(value, key) {
	meumobiSettings.constant(key, value);
});
meumobiSettings.constant('BUILDER',CryptoJS.AES.decrypt('U2FsdGVkX1+sBI1ahObY/pR35qFnWW9EgwmdNIRwoUEPE+hwgW7eIp33mPbDkmUnk1C6Lrh9u3X4lun2AfPT3g==', '9456bbf53af6fdf30a5d625ebf155b4018c8b0aephp').toString(CryptoJS.enc.Utf8));
meumobiSettings.constant('TIMEOUT', 10000);
meumobiSettings.constant('ITEM_PER_PAGE', 20);

meumobiSettings.factory('interceptor', function($q, BUILDER) {
	return {
	'request': function(config) {
		if (config.url.indexOf('SITEBUILDER_API') > -1) {
			config.url = config.url.replace('SITEBUILDER_API', BUILDER + '/api/' + config_data.DOMAIN);
		} else if (config.url.indexOf('STOCKS_URL') > -1) {
			config.url = config.url.replace('STOCKS_URL', 'http://stocks.' + BUILDER.replace(/.*?:\/\//g, ""));
		}
		return config;
	},
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
