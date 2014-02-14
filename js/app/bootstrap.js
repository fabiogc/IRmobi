var meumobiApp = angular.module('meumobiApp', [
  'ngRoute',
  'ngSanitize',
  'meumobiSettings',
  'meumobiServices',
  'meumobiDirectives',
  'meumobiControllers',
  'slugifier'
]);

meumobiApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
  function($routeProvider, $locationProvider, $httpProvider) {
    //commenting out this line (switching to hashbang mode) breaks the app
    //-- unless # is added to the templates
    //$locationProvider.html5Mode(true);

	//handle http errors
	$httpProvider.interceptors.push('errorHttpInterceptor');
	
    $routeProvider.
      when('/', {
        templateUrl: '/themes/rimobi/partials/index.html'
      }).
      when('/categories/:id', {
        templateUrl: '/themes/rimobi/partials/categories/show.html',
        controller: 'CategoryShowCtrl'
      }).
      when('/categories/:id/page/:page', {
    	  templateUrl: '/themes/rimobi/partials/categories/show.html',
          controller: 'CategoryShowCtrl'
      }).
      when('/items/:id', {
        templateUrl: '/themes/rimobi/partials/items/show.html',
        controller: 'ItemShowCtrl'
      }).
      when('/contact', {
          templateUrl: '/themes/rimobi/partials/contact.html',
          controller: 'ContactCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

meumobiApp.run(function($rootScope, API_URL) {
  $rootScope.isOnline = navigator.onLine;

  $rootScope.thumbify = function(imagePath, prefix, defaultImg) {
    var path = imagePath;
    if (path && prefix) {
      var uriParts = imagePath.split('/');
      var file = uriParts.pop();
      path = uriParts.join('/');
      path += '/' + prefix + file;
      return API_URL + path;
    }
    //TODO remove host string
    return defaultImg ? defaultImg : API_URL + path;
  };

  $rootScope.parseUrl = function(url) {
    //TODO handle https links
    if (url.indexOf("http://") == -1) {
      url = "http://" + url;
    }
    return url;
  };
});
