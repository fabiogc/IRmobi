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
      when('/articles/:id', {
        templateUrl: '/themes/rimobi/partials/articles/list.html',
        controller: 'CategoryShowCtrl'
      }).
      when('/extended_articles/:id', {
        templateUrl: '/themes/rimobi/partials/articles/list.html',
        controller: 'CategoryShowCtrl'
      }).
      when('/events/:id', {
        templateUrl: '/themes/rimobi/partials/events/list.html',
        controller: 'CategoryShowCtrl'
      }).
      when('/articles/:id/page/:page', {
        templateUrl: '/themes/rimobi/partials/articles/list.html',
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

meumobiApp.run(function($rootScope, API_URL, $location) {
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

  $rootScope.getClass = function(path) {
    if ($location.path().substr(0, path.length) == path) {
      return "active"
    } else {
      return ""
    }
  };

  $rootScope.splitArray = function(arr, lengthofsublist){
    if (!angular.isUndefined(arr) && arr.length > 0) {
            var arrayToReturn = [];
            var subArray=[];
            var pushed=true;
            for (var i=0; i<arr.length; i++){
                if ((i+1)%lengthofsublist==0){
                    subArray.push(arr[i]);
                    arrayToReturn.push(subArray);
                    subArray=[];
                    pushed=true;
                }
                else{
                    subArray.push(arr[i]);
                    pushed=false;
                }
        }
        if (!pushed)
            arrayToReturn.push(subArray);
        return arrayToReturn;
    }
  };
});
