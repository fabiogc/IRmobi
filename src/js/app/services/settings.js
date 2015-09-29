'use strict';

angular
.module('meumobi', ['meumobi.services.Settings'])
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

