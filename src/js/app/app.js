'use strict';

var app =  angular

.module('meumobiApp', [
	'ngRoute',
	'ngSanitize',
	'ngTouch',
	'meumobi',
	'meumobiSettings',
	'meumobiServices',
	'meumobiFilters',
	'meumobiDirectives',
	'meumobiControllers',
	'meumobi.services.Stock',
	'meumobi.directives.Stock',
	'meumobi.directives.Headlines',
	// 'slugifier',
	// 'truncate',
	'pascalprecht.translate',
	'mediaPlayer',
	'phonegapCalendar',
	//'angulartics',
	//'angulartics.google.analytics.cordova',
	//'meumobi.analytics',
	'angular-adtech',
	'http-with-fallback'
	// 'pushwooshNotification'
])

.config(function($routeProvider, $locationProvider, $httpProvider, CONFIG) {

	var resolveCategory = function($route, Categories) {
		return Categories.load($route.current.params.id).then(function(data) {
			$route.current.$$route.title =  data.title;
			$route.current.$$route.view = '/category/'+data.id;
			return data;
		});
	};

	//handle http errors
	$httpProvider.interceptors.push('interceptor');
	//configure routes
	if (CONFIG.STYLE.homeTemplate == 'latest') {
		$routeProvider.
		when('/', {
			controller: 'LatestController',
			templateUrl: 'items/latest.html',
			title: 'Latest',
			canReload: true,
			view: '/'
		});
	} else {
		$routeProvider.
		when('/', {
			controller: 'HeadlinesController',
			controllerAs: 'vm',
			templateUrl: 'home.html',
			title: 'Home',
			canReload: true,
			view: '/'
		});
	}

	$routeProvider.when('/articles/:id', {
		templateUrl: 'items/list.html',
		controller: 'CategoryShowCtrl',
		canReload: true,
		resolve: {
			viewName: resolveCategory
		}
	}).
	when('/articles/:id/page/:page', {
		templateUrl: 'items/list.html',
		controller: 'CategoryShowCtrl',
		canReload: true,
		resolve: {
			viewName: resolveCategory
		}
	}).
	when('/files', {
		templateUrl: 'files.html',
		controller: 'FilesCtrl',
		view: '/files',
		title: 'Files'
	}).
	when('/news', {
		templateUrl: 'items/news.html',
		controller: 'NewsCtrl',
		view: '/news',
		title: 'News'
	}).
	when('/events/:id', {
		templateUrl: 'events/list.html',
		controller: 'EventListCtrl',
		canReload: true,
		resolve: {
			viewName: resolveCategory
		}
	}).
	when('/events/:id/page/:page', {
		templateUrl: 'events/list.html',
		controller: 'EventListCtrl',
		canReload: true,
		resolve: {
			viewName: resolveCategory
		}
	}).
	when('/latest', {
		templateUrl: 'items/latest.html',
		controller: 'LatestItemsCtrl',
		view: '/latest',
		title: 'Latest',
		canRelaod: true
	}).
	when('/items/:id', {
		templateUrl: 'items/show.html',
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
		templateUrl: 'items/add.html',
		controller: 'ItemAddCtrl',
		title: 'Add Item'
	}).
	when('/contact', {
		templateUrl: 'contact.html',
		controller: 'ContactCtrl',
		view: '/contact',
		title: 'Contact'
	}).
	otherwise({
		redirectTo: '/'
	});
/*
	//configure notification
	if (CONFIG.PUSHWOOSH)
		$pushNotificationProvider.register(CONFIG.PUSHWOOSH);
*/

})

	// See http://codecondo.com/learn-an-easy-way-to-create-a-multilingual-angularjs-app/

.config(function ($translateProvider) {
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
})

/*
	// See http://luisfarzati.github.io/angulartics/#/plugins for details
	
.config('googleAnalyticsCordovaProvider', function(googleAnalyticsCordovaProvider, CONFIG) {
	googleAnalyticsCordovaProvider.trackingId = CONFIG.ANALYTICS.trackId;
	googleAnalyticsCordovaProvider.period = 20; // default: 10 (in seconds)
	googleAnalyticsCordovaProvider.debug = false; // default: false
})
*/
.run(function($rootScope, $route, $location, $translate, Settings, APP, IS_APP) {
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
			return APP.cdnUrl + path;
		}
		//TODO remove host string
		return defaultImg ? defaultImg : APP.cdnUrl + path;
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
	
	$rootScope.getImage = function(path){
		return APP.cdnUrl + path;
	}
  
	//sync data from API 
	$rootScope.reload = function() {
		console.log("Reload Data");
		$rootScope.$broadcast('reloadData');
	};

	$rootScope.canReload = function() {
		if($route.current)
			return $route.current.canReload;
	};

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
		// $analytics.trackPage(current.$$route.title);
		$rootScope.activeView = current.$$route.view;
	});
});
