angular.module('meumobiApp', [
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'meumobi',
    'meumobiSettings',
    'meumobiServices',
    'meumobiFilters',
    'meumobiDirectives',
    'meumobiControllers',
    'slugifier',
    'truncate',
    'pascalprecht.translate',
    'mediaPlayer',
    'phonegapCalendar',
    'angulartics',
    'angulartics.google.analytics',
    'meumobi.analytics',
    'angular-adtech',
    'http-with-fallback',
    'pushwooshNotification'
    ]);

angular.module('meumobiApp').config(function($routeProvider,
      $locationProvider,
      $httpProvider,
      $translateProvider,
      $analyticsProvider,
      $pushNotificationProvider,
      analyticsProvider,
      HOME,
      ANALYTICS) {
      if (!navigator.onLine) {
        $analyticsProvider.virtualPageviews(false);
      }
    
      var resolveCategory = function($route,Categories) {
        return Categories.load($route.current.params.id).then(function(data) {
          $route.current.$$route.title =  data.title;
          $route.current.$$route.view = '/category/'+data.id;
          return data;
        });
      };

      //handle http errors
      $httpProvider.interceptors.push('interceptor');
      //configure routes
      if (HOME == 'latest') {
        $routeProvider.
        when('/', {
          controller: 'LatestItemsCtrl',
          templateUrl: 'themes/rimobi/partials/items/latest.html',
          title: 'Latest',
          view: '/'
        });
      } else {
        $routeProvider.
          when('/', {
            templateUrl: 'themes/rimobi/partials/index.html',
            title: 'Home',
            view: '/'
          });
      }

      $routeProvider.when('/articles/:id', {
        templateUrl: 'themes/rimobi/partials/articles/list.html',
        controller: 'CategoryShowCtrl',
        resolve: {
          viewName: resolveCategory
        }
      }).
      when('/articles/:id/page/:page', {
        templateUrl: 'themes/rimobi/partials/articles/list.html',
        controller: 'CategoryShowCtrl',
        resolve: {
          viewName: resolveCategory
        }
      }).
      when('/extended_articles/:id', {
        templateUrl: 'themes/rimobi/partials/extended_articles/list.html',
        controller: 'CategoryShowCtrl',
        title: 'Article'
      }).
      when('/files', {
        templateUrl: 'themes/rimobi/partials/files.html',
        controller: 'FilesCtrl',
        view: '/files',
        title: 'Files'
      }).
      when('/news', {
        templateUrl: 'themes/rimobi/partials/items/news.html',
        controller: 'NewsCtrl',
        view: '/news',
        title: 'News'
      }).
      when('/extended_articles/:id/page/:page', {
        templateUrl: 'themes/rimobi/partials/extended_articles/list.html',
        controller: 'CategoryShowCtrl'
      }).
      when('/events/:id', {
        templateUrl: 'themes/rimobi/partials/events/list.html',
        controller: 'EventListCtrl',
        resolve: {
          viewName: resolveCategory
        }
      }).
      when('/events/:id/page/:page', {
        templateUrl: 'themes/rimobi/partials/events/list.html',
        controller: 'EventListCtrl',
        resolve: {
          viewName: resolveCategory
        }
      }).
      when('/latest', {
        templateUrl: 'themes/rimobi/partials/items/latest.html',
        controller: 'LatestItemsCtrl',
        view: '/latest',
        title: 'Latest'
      }).
      when('/items/:id', {
        templateUrl: 'themes/rimobi/partials/items/show.html',
        controller: 'ItemShowCtrl',
        resolve: {
          viewName: function($route, Items) {
            return Items.load($route.current.params.id).then(function(response) {;
              $route.current.$$route.title =  response.data.title;
              $route.current.$$route.view = '/category/'+response.data.parent_id;
              return response;
            });
          }
        }
      }).
      when('/items/add/:category_id', {
        templateUrl: 'themes/rimobi/partials/items/add.html',
        controller: 'ItemAddCtrl',
        title: 'Add Item'
      }).
      when('/contact', {
        templateUrl: 'themes/rimobi/partials/contact.html',
        controller: 'ContactCtrl',
        view: '/contact',
        title: 'Contact'
      }).
      otherwise({
        redirectTo: '/'
      });

      //configure notification
      if (config_data.PUSH)
      $pushNotificationProvider.register(config_data.PUSH);

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
      .fallbackLanguage('en');

  //configure GAplugin for analitycs
  if (ANALYTICS) {
    analyticsProvider.setup(ANALYTICS); 
  }

});

angular.module('meumobiApp').run(function($rootScope, $location, $translate, Settings, analytics, SITEBUILDER, IS_APP) {
  //Set site language
  $rootScope.language = Settings.getLanguage();
  $translate.use($rootScope.language);


  $rootScope.isOnline = navigator.onLine;

  $rootScope.goTo = function(path) {
    $location.path(path);
  };

  $rootScope.thumbify = function(imagePath, prefix, defaultImg) {
    var path = imagePath;
    if (path && prefix) {
      var uriParts = imagePath.split('/');
      var file = uriParts.pop();
      path = uriParts.join('/');
      path += '/' + prefix + file;
      return SITEBUILDER + path;
    }
    //TODO remove host string
    return defaultImg ? defaultImg : SITEBUILDER + path;
  };

  $rootScope.parseUrl = function(url) {
    //TODO handle https links
    if (url.indexOf("http://") == -1) {
      url = "http://" + url;
    }
    return url;
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
        } else {
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

  $rootScope.isActive = function (view) { 
    return view === $rootScope.activeView;
  };

  $rootScope.isFutureDate = function (timestamp) {
    var date = new Date(timestamp * 1000);
    var now  = new Date();
    return date > now;
  }

  $rootScope.$on('$routeChangeSuccess', function(e, current){
    //get name from route and send to analytics
    analytics.trackPage(current.$$route.title);
    console.log(current.$$route.view);
    $rootScope.activeView = current.$$route.view;
  });
});
