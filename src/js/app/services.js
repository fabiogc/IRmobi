angular.module('meumobiServices', ['ngResource', 'ngFileUpload', 'meumobi.services.Settings', 'meumobi.services.meumobiSite']);

angular.module('meumobiServices').factory('Site', ['httpWithFallback', '$q', 'meumobiSite', 'CONFIG', function(httpWithFallback, $q, meumobiSite, CONFIG) {
  var service = {};
  var categories = null;
  service.get = function(params) {
    return httpWithFallback.get(meumobiSite.getSiteBuilderApiUrl('/performance'), {timeout: CONFIG.HTTP.timeout}).then(function(response) {
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

angular.module('meumobiServices').factory('Items', ['$resource', 'Upload','$q', 'httpWithFallback', 'CONFIG', 'meumobiSite', 
  function($resource, Upload, $q, httpWithFallback, CONFIG, meumobiSite) {
  var current = null;
  var service = $resource(meumobiSite.getSiteBuilderApiUrl('/items/:id'), {}, {
    save: {method: 'POST', headers : {'Content-Type':'application/x-www-form-urlencoded'}},
    query: {method: 'GET', cache: true, url: meumobiSite.getSiteBuilderApiUrl('/items/search'), timeout: CONFIG.HTTP.timeout}
  });
  service.load = function(id) {
    var deferred = $q.defer();
    if (current && current._id == id) {
       deferred.resolve({data: current});
    } else {
      return httpWithFallback.get(meumobiSite.getSiteBuilderApiUrl('/items/'+id), {timeout: CONFIG.HTTP.timeout});
    }
    return deferred.promise;
  };
  service.latest = function() {
    return httpWithFallback.get(meumobiSite.getSiteBuilderApiUrl('/items/latest'), {timeout: CONFIG.HTTP.timeout});
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
      url: meumobiSite.getSiteBuilderApiUrl('/images'),
      method: 'POST',
      headers: {},
      data: data ? data : {},
      fileFormDataName: 'image',
      file: file
     }); 
   };
  return service;
}]);

angular.module('meumobiServices').factory('Categories', ['$resource', '$q', 'httpWithFallback', 'CONFIG', 'meumobiSite',
  function($resource, $q, httpWithFallback, CONFIG, meumobiSite) {
    var service = {}; 
    service.load = function(id) {
      var deferred = $q.defer();
      httpWithFallback.get(meumobiSite.getSiteBuilderApiUrl('/categories/'+ id), {timeout: CONFIG.HTTP.timeout})
      .then(function(response) {
        deferred.resolve(response.data);
      }, function(reason) {
        deferred.reject(reason);
      });
      return deferred.promise;
    };

    service.items = function(id, params) {
     return httpWithFallback.get(meumobiSite.getSiteBuilderApiUrl('/categories/'+ id +'/items'), {timeout: CONFIG.HTTP.timeout, params: params});
    }
    service.getTree = function getTree(categories) {//TODO remove parameter
			// victor.dias: moved to meumobiSite 
    }
    return service;
  }]);
