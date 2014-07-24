var meumobiServices = angular.module('meumobiServices', ['ngResource', 'angularFileUpload']);

meumobiServices.factory('Site', ['$resource', 'SITEBUILDER_API', 'TIMEOUT', function($resource, SITEBUILDER_API, TIMEOUT) {
return $resource(SITEBUILDER_API + '/performance', {}, {
		get: {cache: true, method: 'GET', timeout: TIMEOUT},
				 feed: {method: 'GET', cache: true, url:  SITEBUILDER_API + '/news', timeout: TIMEOUT}
	});
}]);
meumobiServices.factory('Items', ['$resource', '$upload', 'SITEBUILDER_API', 'TIMEOUT', function($resource, $upload, SITEBUILDER_API, TIMEOUT) {
	var service = $resource(SITEBUILDER_API + '/items/:id', {}, {
		get: {cache: true, method: 'GET', timeout: TIMEOUT},
    save: {method: 'POST', headers : {'Content-Type':'application/x-www-form-urlencoded'}},
		query: {method: 'GET', cache: true, url: SITEBUILDER_API + '/items/search', timeout: TIMEOUT},
		latest: {method: 'GET', cache: true, url: SITEBUILDER_API + '/items/latest', timeout: TIMEOUT}
	});
	service.getMedias = function(item, mediaType) {
		var medias = [];
		if (item.medias instanceof Array) {
			for(var k in item.medias) {
				var media = item.medias[k];
				if (typeof mediaType == 'function' && !mediaType(media) 
					|| typeof mediaType == 'string' && media.type && media.type.indexOf(mediaType) != 0)
					continue;
				medias.push({
					src: media.url,
					type: media.type,
					title: media.title
				});
			}
		}
		return medias
	};
  service.upload = function(file, data) {
    return $upload.upload({
      url: SITEBUILDER_API + '/images',
      method: 'POST',
      headers: {},
      data: data ? data : {},
      fileFormDataName: 'image',
      file: file
     }); 
   };
	return service;
}]);
meumobiServices.factory('Categories', ['$resource', 'SITEBUILDER_API', 'TIMEOUT', function($resource, SITEBUILDER_API, TIMEOUT) {
	var categories = $resource(SITEBUILDER_API +'/categories/:id', {}, {
		get: {cache: true, method: 'GET', timeout: TIMEOUT},
			items: {method: 'GET', cache: true, url: SITEBUILDER_API + '/categories/:id/items', timeout: TIMEOUT}
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
meumobiServices.factory('Stock', ['$http', '$q', 'STOCKS_API', 'TIMEOUT', function($http, $q, STOCKS_API, TIMEOUT) {
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
			$http.get(STOCKS_API, {timeout: TIMEOUT, params: params})
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
