angular.module('meumobiServices', ['ngResource', 'angularFileUpload','meumobi']);

angular.module('meumobiServices').factory('Site', ['httpWithFallback', '$q', 'Settings', 'TIMEOUT', function(httpWithFallback, $q, Settings, TIMEOUT) {
  var service = {};
  var categories = null;
  service.get = function(params) {
    return httpWithFallback.get(Settings.getSiteBuilderApiUrl() + '/performance', {timeout: TIMEOUT}).then(function(response) {
      categories = response.data.categories;
      return response;
    });
  };

  service.categories = function() {
    return categories;
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

angular.module('meumobiServices').factory('Items', ['$resource', '$upload','$q', 'httpWithFallback', 'Settings', 'TIMEOUT',
  function($resource, $upload, $q, httpWithFallback, Settings, TIMEOUT) {
  var current = null;
  var service = $resource(Settings.getSiteBuilderApiUrl() + '/items/:id', {}, {
    save: {method: 'POST', headers : {'Content-Type':'application/x-www-form-urlencoded'}},
    query: {method: 'GET', cache: true, url: Settings.getSiteBuilderApiUrl() + '/items/search', timeout: TIMEOUT}
  });
  service.load = function(id) {
    var deferred = $q.defer();
    if (current && current._id == id) {
       deferred.resolve({data: current});
    } else {
      return httpWithFallback.get(Settings.getSiteBuilderApiUrl() + '/items/'+id, {timeout: TIMEOUT});
    }
    return deferred.promise;
  };
  service.latest = function() {
    return httpWithFallback.get(Settings.getSiteBuilderApiUrl() + '/items/latest', {timeout: TIMEOUT});
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
      url: Settings.getSiteBuilderApiUrl() + '/images',
      method: 'POST',
      headers: {},
      data: data ? data : {},
      fileFormDataName: 'image',
      file: file
     }); 
   };
  return service;
}]);

angular.module('meumobiServices').factory('Categories', ['$resource', '$q', 'httpWithFallback', 'Settings', 'TIMEOUT',
  function($resource, $q, httpWithFallback, Settings, TIMEOUT) {
    var service = {}; 
    service.load = function(id) {
      var deferred = $q.defer();
      httpWithFallback.get(Settings.getSiteBuilderApiUrl() + '/categories/'+ id, {timeout: TIMEOUT})
      .then(function(response) {
        deferred.resolve(response.data);
      }, function(reason) {
        deferred.reject(reason);
      });
      return deferred.promise;
    };

    service.items = function(id, params) {
     return httpWithFallback.get(Settings.getSiteBuilderApiUrl() + '/categories/'+ id +'/items', {timeout: TIMEOUT, params: params});
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

angular.module('meumobiServices').factory('Stock', ['$http', '$q', 'STOCKS_API', 'TIMEOUT', function($http, $q, STOCKS_API, TIMEOUT) {
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
