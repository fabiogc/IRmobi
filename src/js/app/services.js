angular.module('meumobiServices', ['ngResource', 'ngFileUpload', 'meumobiSettings']);

angular.module('meumobiServices').factory('Site', ['httpWithFallback', '$q', 'Settings', 'CONFIG', function(httpWithFallback, $q, Settings, CONFIG) {
  var service = {};
  var categories = null;
  service.get = function(params) {
    return httpWithFallback.get(Settings.getSiteBuilderApiUrl() + '/performance', {timeout: CONFIG.HTTP.timeout}).then(function(response) {
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

angular.module('meumobiServices').factory('Items', ['$resource', 'Upload','$q', 'httpWithFallback', 'Settings', 'CONFIG',
  function($resource, Upload, $q, httpWithFallback, Settings, CONFIG) {
  var current = null;
  var service = $resource(Settings.getSiteBuilderApiUrl() + '/items/:id', {}, {
    save: {method: 'POST', headers : {'Content-Type':'application/x-www-form-urlencoded'}},
    query: {method: 'GET', cache: true, url: Settings.getSiteBuilderApiUrl() + '/items/search', timeout: CONFIG.HTTP.timeout}
  });
  service.load = function(id) {
    var deferred = $q.defer();
    if (current && current._id == id) {
       deferred.resolve({data: current});
    } else {
      return httpWithFallback.get(Settings.getSiteBuilderApiUrl() + '/items/'+id, {timeout: CONFIG.HTTP.timeout});
    }
    return deferred.promise;
  };
  service.latest = function() {
    return httpWithFallback.get(Settings.getSiteBuilderApiUrl() + '/items/latest', {timeout: CONFIG.HTTP.timeout});
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
    return Upload.upload({
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

angular.module('meumobiServices').factory('Categories', ['$resource', '$q', 'httpWithFallback', 'Settings', 'CONFIG',
  function($resource, $q, httpWithFallback, Settings, CONFIG) {
    var service = {}; 
    service.load = function(id) {
      var deferred = $q.defer();
      httpWithFallback.get(Settings.getSiteBuilderApiUrl() + '/categories/'+ id, {timeout: CONFIG.HTTP.timeout})
      .then(function(response) {
        deferred.resolve(response.data);
      }, function(reason) {
        deferred.reject(reason);
      });
      return deferred.promise;
    };

    service.items = function(id, params) {
     return httpWithFallback.get(Settings.getSiteBuilderApiUrl() + '/categories/'+ id +'/items', {timeout: CONFIG.HTTP.timeout, params: params});
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
