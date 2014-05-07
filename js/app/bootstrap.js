var meumobiApp = angular.module('meumobiApp', [
  'ngRoute',
  'ngSanitize',
  'meumobiSettings',
  'meumobiServices',
  'meumobiDirectives',
  'meumobiControllers',
  'slugifier',
  'pascalprecht.translate',
  'angulartics',
  'angulartics.google.analytics'
]);

meumobiApp.config(['$routeProvider', '$locationProvider', '$httpProvider', '$translateProvider', '$analyticsProvider', 'LOCALE',
  function($routeProvider, $locationProvider, $httpProvider, $translateProvider,$analyticsProvider, LOCALE) {
    if (!navigator.onLine) {
      $analyticsProvider.virtualPageviews(false);
    }
    //handle http errors
    $httpProvider.interceptors.push('errorHttpInterceptor');
    //configure routes
    $routeProvider.
      when('/', {
        templateUrl: 'themes/rimobi/partials/index.html'
      }).
      when('/articles/:id', {
        templateUrl: 'themes/rimobi/partials/articles/list.html',
        controller: 'CategoryShowCtrl'
      }).
      when('/articles/:id/page/:page', {
        templateUrl: 'themes/rimobi/partials/articles/list.html',
        controller: 'CategoryShowCtrl'
      }).
      when('/extended_articles/:id', {
        templateUrl: 'themes/rimobi/partials/extended_articles/list.html',
        controller: 'CategoryShowCtrl'
      }).
      when('/extended_articles/:id/page/:page', {
        templateUrl: 'themes/rimobi/partials/extended_articles/list.html',
        controller: 'CategoryShowCtrl'
      }).
      when('/events/:id', {
        templateUrl: 'themes/rimobi/partials/events/list.html',
        controller: 'EventListCtrl'
      }).
      when('/events/:id/page/:page', {
        templateUrl: 'themes/rimobi/partials/events/list.html',
        controller: 'EventListCtrl'
      }).
      when('/items/:id', {
        templateUrl: 'themes/rimobi/partials/items/show.html',
        controller: 'ItemShowCtrl'
      }).
      when('/contact', {
        templateUrl: 'themes/rimobi/partials/contact.html',
        controller: 'ContactCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
    //configure translations
    for (var lang in translations) {
      $translateProvider.translations(lang, translations[lang]);
    }
    $translateProvider
    .registerAvailableLanguageKeys(['en', 'pt'], {
        'en_US': 'en',
        'en_UK': 'en',
        'en-US': 'en',
        'pt-BR': 'pt',
        'pt_BR': 'pt'
    })
    .fallbackLanguage('en')
    if (LOCALE == 'auto') {
      $translateProvider.determinePreferredLanguage();
    } else {
      $translateProvider.preferredLanguage(LOCALE);
    }
  }]);

meumobiApp.run(function($rootScope, $location, API_URL, IS_APP, ANALYTICS) {
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
      if (path == "/" && $location.path() == "/") {
        return "active";
      } else if (path == "/") {
        return "";
      }
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

  $rootScope.parseFloat = parseFloat;

  $rootScope.isFutureDate = function (timestamp) {
    var date = new Date(timestamp * 1000);
    var now  = new Date();
    return date > now;
  }

  //phonegap analitycs
  if (IS_APP && ANALYTICS) {
	  gaPlugin = window.plugins.gaPlugin;
	  gaPlugin.init(nativePluginResultHandler, nativePluginErrorHandler, ANALYTICS, 10);
	  function nativePluginResultHandler (result) {
			console.log('nativePluginResultHandler: '+result);
		}
		function nativePluginErrorHandler (error) {
			console.log('nativePluginErrorHandler: '+error);
    }
    $rootScope.$on('$routeChangeSuccess', function(){
      gaPlugin.trackPage( nativePluginResultHandler, nativePluginErrorHandler, ''+$location.url());
    });
  }
});
