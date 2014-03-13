var meumobiServices = angular.module('meumobiServices', ['ngResource']);

meumobiServices.factory('Site', ['$resource', 'utils','TIMEOUT',
    function($resource, utils, TIMEOUT) {
      return $resource(utils.getApiUrl() + '/performance', {}, {
        get: {cache: true, method: 'GET', timeout: TIMEOUT},
        feed: {method: 'GET', cache: true, url:  utils.getApiUrl() + '/news', timeout: TIMEOUT}
      });
    }]);
meumobiServices.factory('Items', ['$resource', 'utils','TIMEOUT',
    function($resource, utils, TIMEOUT) {
      return $resource(utils.getApiUrl() + '/items/:id', {}, {
        get: {cache: true, method: 'GET', timeout: TIMEOUT},
        query: {method: 'GET', cache: true, url: utils.getApiUrl() + '/items/search', timeout: TIMEOUT}
      });
    }]);
meumobiServices.factory('Categories', ['$resource', 'utils', 'TIMEOUT',
    function($resource, utils, TIMEOUT) {
      return $resource(utils.getApiUrl() + '/categories/:id', {}, {
        get: {cache: true, method: 'GET', timeout: TIMEOUT},
        items: {method: 'GET', cache: true, url: utils.getApiUrl() + '/categories/:id/items', timeout: TIMEOUT}
      });
    }]);
var meumobiControllers = angular.module('meumobiControllers', ['angularLocalStorage']);

meumobiControllers.controller('SiteCtrl', ['$scope', 'storage', 'Site',
    function($scope, storage, Site, Category) {
      storage.bind($scope,'performance');
      $scope.headlinesRows = 2;

      Site.get({}, function(data) {
        $scope.performance = data;
        var categories = data.categories.slice(0);
        if (data.site.title == "Santander") {
            $scope.firstCategory = categories.shift();
            $scope.headlinesRows = 1;
        }
 
        $scope.splitedCategories = $scope.splitArray(categories, 2);
      });
    }]);

meumobiControllers.controller('CategoryShowCtrl', ['$scope', 'Categories', '$routeParams',
    function($scope, Categories, $routeParams) {
      $scope.category = Categories.get({id: $routeParams.id});

      $scope.currentPage = $routeParams.page ? $routeParams.page : 1;//set current pagination page

      $scope.items = Categories.items({id: $routeParams.id, page: $scope.currentPage}, function(data){
        $scope.items = data.items;
      });
    }]);

meumobiControllers.controller('ItemShowCtrl', ['$scope', 'Items', 'Categories', '$routeParams',
    function($scope, Items, Categories, $routeParams) {
      $scope.item = Items.get({id: $routeParams.id}, function(data) {
        $scope.category = Categories.get({id: data.parent_id});
      });
    }]);

meumobiControllers.controller('ContactCtrl', ['$scope', '$http',
    function($scope, $http) {
      $scope.formData = {};
      $scope.submit = function() {
        if ($('#contact-form').parsley('validate')) {//this is a validation a from "first" theme
          $http({
            method: 'POST',
            url:'/index/contact',
            data: $.param($scope.formData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
          })
          .success(function(data) {
            console.log(data);
            if (data.success) {
              $scope.success = data.message;
            } else {
              $scope.error = data.message; 
            }
          });
        }
      };
    }]);
var meumobiDirectives = angular.module('meumobiDirectives', ['meumobiSettings']);

meumobiDirectives.directive('pagination', [ 'ITEM_PER_PAGE', function(ITEM_PER_PAGE) {
	var paginate = function(scope) {
		var total  = scope.category.items_count;
		if (!total) return;//do nothig if has no item
		var perPage = scope.perPage ? scope.perPage : ITEM_PER_PAGE;//use default limit if none is passed
		scope.totalPages = Math.ceil(total / perPage);
		scope.hasNextPage = scope.current != scope.totalPages;
		scope.hasPreviusPage = scope.current > 1;
		scope.nextPage = parseInt(scope.current) + 1;
		scope.previusPage = parseInt(scope.current) - 1;
	};

	return {
		restrict: 'E',
		scope: {
			category: '=',
			perPage: '=',
			current: '=',
			uri: '='
		},
		templateUrl: '/themes/rimobi/partials/pagination.html',
		link: function(scope) {
			scope.pages = function(n){
				var data = []
				for(var i = 0; i < n; i++) {
					data.push(i + 1);
				}
				return data;
			};
			scope.parseUri = function(page) {
				return scope.uri.replace(':page',page).replace(':id',scope.category.id);
			};
			scope.category.$promise.then(function(){
				paginate(scope);
			});
		}
	};
}]);

meumobiDirectives.directive('headlines', [ 'Categories', function(Categories) {
	return {
		restrict: 'E',
		scope: {
			category: '=',
			limit: '='
		},
		templateUrl: '/themes/rimobi/partials/categories/headlines.html',
		link: function(scope) {
			scope.template = '/themes/rimobi/partials/'+scope.category.type+'/headlines.html';
			Categories.items({id: scope.category.id, page:1}, function(data){
				scope.items = data.items;
		});
		}
	};
}]);

meumobiDirectives.directive('breadcrumb', function(Categories) {
	return {
		restrict: 'E',
		scope: {
			title: '@',
			link: '@'
		},
		templateUrl: '/themes/rimobi/partials/utils/breadcrumb.html'
	};
});

meumobiDirectives.directive('yahooFinance', ['$http', function($http) {
	return {
		restrict: 'E',
		templateUrl: '/themes/rimobi/partials/widgets/yahoo_finance.html',
		link: function(scope) {
			var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22SANB11.SA%22%2C%22SANB3.SA%22%2C%22SANB4.SA%22%2C%22BSBR%22)%0A%09%09&format=json&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback=';
			$http.get(url).success(function(data) {
				scope.created_at = data.query.created;
				scope.mainQuote = data.query.results.quote.shift();
				scope.quotes = data.query.results.quote;
			});
		}
	};
}]);var meumobiSettings = angular.module('meumobiSettings',[]);

angular.forEach(config_data,function(value, key) {
	meumobiSettings.constant(key, value);
});

meumobiSettings.constant('TIMEOUT', 10000);
meumobiSettings.constant('ITEM_PER_PAGE', 20);

meumobiSettings.factory('utils', ['$location', 'API_URL', 'DOMAIN',
  function($location, API_URL, DOMAIN){
    var utils = {};
    utils.getApiUrl = function() {
      if (typeof DOMAIN != 'undefined') {
        return API_URL + '/api/' + DOMAIN;
      }
      return API_URL + '/api/' + $location.host();
    };
    return utils;
  }]);

meumobiSettings.factory('errorHttpInterceptor', function($q) {
	  return {
	   'requestError': function(rejection) {
	      // do something on error
	      alert('Sorry an error occured, please try again later');
	      console.log(rejection);
	      return $q.reject(rejection);
	    },
	   'responseError': function(rejection) {
	      // do something on error
		  alert('Sorry an error occured, please try again later');
		  console.log(rejection);
		  return $q.reject(rejection);
	    }
	  };
	});
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
});
