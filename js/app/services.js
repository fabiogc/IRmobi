var meumobiServices = angular.module('meumobiServices', ['ngResource']);

meumobiServices.factory('Site', ['$resource', 'utils','TIMEOUT', function($resource, utils, TIMEOUT) {
	return $resource(utils.getApiUrl() + '/performance', {}, {
		get: {cache: true, method: 'GET', timeout: TIMEOUT},
		feed: {method: 'GET', cache: true, url:  utils.getApiUrl() + '/news', timeout: TIMEOUT}
	});
}]);
meumobiServices.factory('Items', ['$resource', 'utils','TIMEOUT', function($resource, utils, TIMEOUT) {
	return $resource(utils.getApiUrl() + '/items/:id', {}, {
		get: {cache: true, method: 'GET', timeout: TIMEOUT},
		query: {method: 'GET', cache: true, url: utils.getApiUrl() + '/items/search', timeout: TIMEOUT}
	});
}]);
meumobiServices.factory('Categories', ['$resource', 'utils', 'TIMEOUT', function($resource, utils, TIMEOUT) {
	return $resource(utils.getApiUrl() + '/categories/:id', {}, {
		get: {cache: true, method: 'GET', timeout: TIMEOUT},
		items: {method: 'GET', cache: true, url: utils.getApiUrl() + '/categories/:id/items', timeout: TIMEOUT}
	});
}]);
meumobiServices.factory('Stock', ['$http', '$q', 'TIMEOUT', 'SERVICES_URL', function($http, $q, TIMEOUT, SERVICES_URL) {
	return {
		getQuotes: function(code) {
			var deferred = $q.defer();
			var params = {};
			if (code.indexOf(':') === 0) {//is profile
				params.action = 'enfoquify';
				params.profile = code.substring(1);
			} else {
				params.action = 'yahoofy';
				params.codes = code;
			}
			$http.get(SERVICES_URL + '/stocks/',{timeout: TIMEOUT, params: params})
			.success(function(data) {
				deferred.resolve(data);
			})
			.error(function(reason){
				deferred.reject(reason);
			});
			return deferred.promise;
		}
	};
}]);
