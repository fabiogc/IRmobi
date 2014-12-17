var meumobiServices = angular.module('meumobiServices', ['ngResource', 'angularFileUpload']);

meumobiServices.factory('Site', ['httpWithFallback', '$q', 'SITEBUILDER_API', 'TIMEOUT', function(httpWithFallback, $q, SITEBUILDER_API, TIMEOUT) {
  var service = {};
  var performance = null;
  service.get = function(params) {
    var deferred = $q.defer();
    if (performance) {
      deferred.resolve(performance);
    } else {
      httpWithFallback.get(SITEBUILDER_API + '/performance', {timeout: TIMEOUT}).then(function(response) {
        performance = response.data;
        deferred.resolve(performance);
      }, function(reason) {
        deferred.reject(reason);
      });
    }
    return deferred.promise;
  };

  service.categories = function() {
    return performance ? performance.categories : null;
  }

  service.news = function() {
    var deferred = $q.defer();
    this.get().then(function(data) {
      deferred.resolve(data.news);
    }, function(reason) {
      deferred.reject(reason);
    });
    return deferred.promise;
  };
  return service;
}]);

meumobiServices.factory('Items', ['$resource', '$upload','$q', 'httpWithFallback', 'SITEBUILDER_API', 'TIMEOUT', 
  function($resource, $upload, $q, httpWithFallback, SITEBUILDER_API, TIMEOUT) {
	var current = null;
  var service = $resource(SITEBUILDER_API + '/items/:id', {}, {
    save: {method: 'POST', headers : {'Content-Type':'application/x-www-form-urlencoded'}},
		query: {method: 'GET', cache: true, url: SITEBUILDER_API + '/items/search', timeout: TIMEOUT}
	});
  service.load = function(id) {
    var deferred = $q.defer();
    if (current && current._id == id) {
       deferred.resolve(current);
    } else {
      httpWithFallback.get(SITEBUILDER_API + '/items/'+id, {timeout: TIMEOUT})
      .then(function(response) {
        deferred.resolve(response.data);
      }, function(reason) {
        deferred.reject(reason);
      });
    }
    return deferred.promise;
  };
  service.latest = function() {
    return httpWithFallback.get(SITEBUILDER_API + '/items/latest', {timeout: TIMEOUT});
  };
	service.getMedias = function(item, mediaType) {
		var medias = [];
		if (item.medias instanceof Array) {
			for(var k in item.medias) {
				var media = item.medias[k];
				if (typeof mediaType == 'function' && !mediaType(media) 
					|| typeof mediaType == 'string' && media.type && media.type.indexOf(mediaType) != 0)
					continue;
				medias.push(media);
			}
		}
		return medias
	};
  service.setCurrent = function(item) {
    current = item;
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

meumobiServices.factory('Categories', ['$resource', 'httpWithFallback', 'SITEBUILDER_API', 'TIMEOUT', 
  function($resource, httpWithFallback, SITEBUILDER_API, TIMEOUT) {
    var service = $resource(SITEBUILDER_API +'/categories/:id', {}, {
      get: {cache: true, method: 'GET', timeout: TIMEOUT},
      //items: {method: 'GET', cache: true, url: SITEBUILDER_API + '/categories/:id/items', timeout: TIMEOUT}
    });
    service.items = function(id, params) {
     return httpWithFallback.get(SITEBUILDER_API + '/categories/'+ id +'/items', {timeout: TIMEOUT, params: params});
    }
    service.getTree = function getTree(categories) {//TODO remove parameter
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
    return service;
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
