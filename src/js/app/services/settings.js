angular.module('meumobi').factory('Settings', function(SITEBUILDER, DOMAINS) {
	return {
    getAvailableLanguages : function() {
      return Object.keys(DOMAINS);
    },
    setLanguage : function(language) {
      localStorage['Settings.language'] = language;
    },
	  getLanguage : function() {
      //invalid language setted, change for the first language available
      if (!DOMAINS[localStorage['Settings.language']]) {
        this.setLanguage(this.getAvailableLanguages()[0]);
      }
      return localStorage['Settings.language'];
    },
    getSiteBuilderApiUrl : function(uri) {
      uri = uri ? uri : '';
      return SITEBUILDER + '/api/' + DOMAINS[this.getLanguage()] + uri;
    }
	};
})
.factory('interceptor', function($q, $rootScope) {
  return {
    request: function(config) {
      $rootScope.$broadcast('loading:start');
      return config;
    },
    response: function(response) {
      $rootScope.$broadcast('loading:start');
      return response;
    }
    requestError: function(rejection) {
      $rootScope.$broadcast('loading:end');
      console.log(rejection);
      return $q.reject(rejection);
    },
    responseError: function(rejection) {
      $rootScope.$broadcast('loading:end');
      return $q.reject(rejection);
    }
  };
});

