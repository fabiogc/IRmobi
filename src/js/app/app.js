'use strict';

var app =  angular

.module('meumobiApp', [
	'ngRoute',
	'ngResource',
	'ngSanitize',
	'ngLocale',
	'ngTouch',
	'ng-fastclick',
	'meumobi',
	'meumobi.services.Settings',
	'meumobi.services.Language',
	'meumobiServices',
	'meumobi.filters.Common',
	'meumobi.filters.DownloadFiles',
	'meumobiDirectives',
	'meumobiControllers',
	'meumobi.services.Stock',
	'meumobi.services.Site',
	'meumobi.services.Utils',
	'meumobi.services.Bootstrap',
	'meumobi.directives.Stock',
	'meumobi.directives.Headlines',
	// 'slugifier',
	// 'truncate',
	'pascalprecht.translate',
	'mediaPlayer',
	'phonegapCalendar',
	'angulartics',
	'angulartics.google.analytics.cordova',
	'angular-adtech',
	'http-with-fallback',
	'pushwooshNotification',
	'meumobi.services.meumobiSite',
	'ImgCache'
])

.config(function($routeProvider, $locationProvider, $httpProvider, CONFIG) {

	var resolveCategory = function($route, meumobiSite) {
		return meumobiSite.getCategory($route.current.params.id).then(function(data) {
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
		controller: 'ItemsListController',
		controllerAs: 'vm',
		templateUrl: 'items/list.html',
		canReload: true,
		resolve: {
			viewName: resolveCategory
		}
	}).
	when('/articles/:id/page/:page', {
		controller: 'ItemsListController',
		controllerAs: 'vm',
		templateUrl: 'items/list.html',
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
		controller: 'EventsController',
		controllerAs: 'vm',
		templateUrl: 'events/list.html',
		canReload: true,
		resolve: {
			viewName: resolveCategory
		}
	}).
	when('/events/:id/page/:page', {
		controller: 'EventsController',
		controllerAs: 'vm',
		templateUrl: 'events/list.html',
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
		controller: 'ItemsShowController',
		controllerAs: 'vm',
		templateUrl: 'items/show.html',
		resolve: {
			viewName: function($route, meumobiSite) {
				return meumobiSite.getSelectedItem().then(function(item) {
					console.log("Items Show");
					console.log(item);
					$route.current.$$route.title =  item.title;
					$route.current.$$route.view = '/items/' + item.id;
					return item;
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
		controller: 'ContactController',
		controllerAs: 'vm',
		view: '/contact',
		title: 'Contact'
	}).
	otherwise({
		redirectTo: '/'
	});
})
/*
.config(function ($pushNotificationProvider, CONFIG) {
	$pushNotificationProvider.register(CONFIG.PUSHWOOSH);
	console.log("Register to Pushwoosh");
	// console.log(CONFIG.PUSHWOOSH);
})
*/
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

.config(function (meumobiSiteProvider, APP) {
	meumobiSiteProvider.cdnUrl = APP.cdnUrl;
	meumobiSiteProvider.apiUrl = APP.apiUrl;
	meumobiSiteProvider.domains = APP.DOMAINS;
	meumobiSiteProvider.setCurrentLanguage = localStorage.language ? localStorage.language : "pt";
})


	// See http://luisfarzati.github.io/angulartics/#/plugins for details
	
.config(function(googleAnalyticsCordovaProvider, CONFIG) {
	console.log("Google Analytics TrackId: " + CONFIG.ANALYTICS.trackId);
	googleAnalyticsCordovaProvider.trackingId = CONFIG.ANALYTICS.trackId;
	googleAnalyticsCordovaProvider.period = 20; // default: 10 (in seconds)
	googleAnalyticsCordovaProvider.debug = @@debug; // default: false
})

.config(function(ImgCacheProvider) {
	// or more options at once
	ImgCacheProvider.setOptions({
		debug: @@debug,
		usePersistentCache: true
	});

	// ImgCache library is initialized automatically,
	// but set this option if you are using platform like Ionic -
	// in this case we need init imgcache.js manually after device is ready
	ImgCacheProvider.manualInit = true;
})

.run(function($rootScope, $route, $location, $translate, APP, IS_APP, BootstrapService, meumobiSite) {
	
	BootstrapService.startApp();
	
	//Set site language
	// $rootScope.language = Settings.getLanguage();
	// $translate.use($rootScope.language);

	$rootScope.isOnline = navigator.onLine;

	$rootScope.goTo = function(path) {
		$('body').removeClass('slide-nav slide-nav-left');
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
		var src = APP.cdnUrl + path
		if (localStorage.hasOwnProperty(path)) {
			src = localStorage[path];
		}
		return src;
	};
	
	$rootScope.goToItem = function(item) {
		meumobiSite.setSelectedItem(item);
		$location.path('/items/'+ item._id);
	};
	
	//sync data from API 
	$rootScope.reload = function() {
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
	};

	$rootScope.$on('$routeChangeSuccess', function(e, current){
		//get name from route and send to analytics
		// $analytics.trackPage(current.$$route.title);
		$rootScope.activeView = current.$$route.view;
	});
});
