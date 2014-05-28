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
		query: {method: 'GET', cache: true, url: utils.getApiUrl() + '/items/search', timeout: TIMEOUT},
		latest: {method: 'GET', cache: true, url: utils.getApiUrl() + '/items/latest', timeout: TIMEOUT}
	});
}]);
meumobiServices.factory('Categories', ['$resource', 'utils', 'TIMEOUT', function($resource, utils, TIMEOUT) {
	var categories = $resource(utils.getApiUrl() + '/categories/:id', {}, {
		get: {cache: true, method: 'GET', timeout: TIMEOUT},
		items: {method: 'GET', cache: true, url: utils.getApiUrl() + '/categories/:id/items', timeout: TIMEOUT}
	});
	categories.getTree = function getTree(categories) {//TODO remove parameter
		var children = [];
		children[0] = [];
		for(var key in categories) {
			var parent_id = categories[key].parent_id != null ? categories[key].parent_id : 0;
			if (!children[parent_id])
				children[parent_id] = [];
			children[parent_id].push(categories[key]);
		}
		for(var key in categories) {
			var category = categories[key];
			category.children = [];
			if (children[category.id])
				category.children = children[category.id];
		}
		return children[0];
	}
	return categories;
}]);
meumobiServices.factory('Stock', ['$http', '$q', 'TIMEOUT', 'STOCKS_URL', function($http, $q, TIMEOUT, STOCKS_URL) {
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
			$http.get(STOCKS_URL,{timeout: TIMEOUT, params: params})
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
