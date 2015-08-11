'use strict';

angular
.module('meumobi', ['meumobiSettings'])
.factory('Settings', ['APP', 
function(APP) {
	return {
    getAvailableLanguages : function() {
      return Object.keys(APP.DOMAINS);
    },
    setLanguage : function(language) {
      localStorage['Settings.language'] = language;
    },
	  getLanguage : function() {
      //invalid language setted, change for the first language available
      if (!APP.DOMAINS[localStorage['Settings.language']]) {
        this.setLanguage(this.getAvailableLanguages()[0]);
      }
      return localStorage['Settings.language'];
    },
    getSiteBuilderApiUrl : function(uri) {
      uri = uri ? uri : '';
      return APP.apiUrl + APP.DOMAINS[this.getLanguage()] + uri;
    }
	};
}
])
.factory('interceptor', function($q, $rootScope) {
  return {
    request: function(config) {
      $rootScope.$emit('loading:start');
      return config;
    },
    response: function(response) {
      $rootScope.$emit('loading:end');
      return response;
    },
    requestError: function(rejection) {
      $rootScope.$emit('loading:end');
      console.log(rejection);
      return $q.reject(rejection);
    },
    responseError: function(rejection) {
      $rootScope.$emit('loading:end');
      return $q.reject(rejection);
    }
  };
});

