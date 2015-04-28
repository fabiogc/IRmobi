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
		templateUrl: 'themes/rimobi/partials/utils/pagination.html',
		link: function(scope) {
			scope.pages = function(n){
				var data = []
				for(var i = 0; i < n; i++) {
					data.push(i + 1);
				}
				return data;
			};
			scope.parseUri = function(page) {
				return scope.uri.replace(':page',page).replace(':type',scope.category.type).replace(':id',scope.category.id);
			};
      
			scope.$watch('category',function(value) {
        if (value)
				  paginate(scope);
			});
		}
	};
}]);

meumobiDirectives.directive('headlines', ['$location', 'Categories', 'Items', function($location, Categories, Items) {
	return {
		restrict: 'E',
		scope: {
			category: '=',
			limit: '='
		},
		templateUrl: 'themes/rimobi/partials/categories/headlines.html',
		link: function(scope) {
			scope.template = 'themes/rimobi/partials/'+scope.category.type+'/headlines.html';
			Categories.items(scope.category.id,{page:1}).then(function(response){
				scope.items = response.data.items;
		  });
      scope.goToItem = function(item) {
        Items.setCurrent(item);
        $location.path('/items/'+ item._id);
      };
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
		templateUrl: 'themes/rimobi/partials/utils/breadcrumb.html'
	};
});

meumobiDirectives.directive('stock', ['Stock', function(Stock) {
	return {
		restrict: 'E',
		scope: {code: '='},
		template: '<ng-include src="templatePath"></ng-include>',
		link: function(scope) {
			scope.parseFloat = parseFloat;
			if (!scope.code) return;
			Stock.getQuotes(scope.code).then(function(data) {
        if (!data.query) return;
				var quotes = data.query.results.quote;
				scope.source = (scope.code.indexOf(':') === 0) ? 'Enfoque' : 'Yahoo';
				if (quotes.length >=4) {
					scope.quotes = quotes;
					scope.mainQuote = quotes.shift();
					scope.templatePath = 'themes/rimobi/partials/widgets/stock/multi-quotes.html';
				} else {
					var first = (quotes instanceof Array) ? quotes.shift() : quotes;
					scope.title = first.symbol;
					scope.tradePrice = first.LastTradePriceOnly;
					scope.change = first.ChangeinPercent;
					scope.high = first.DaysHigh;
					scope.low = first.DaysLow;
					scope.volume = first.Volume
					scope.templatePath = 'themes/rimobi/partials/widgets/stock/single-quote.html';
				}
			});
		}
	};
}]);

meumobiDirectives.directive('navMenu', ['$location', '$timeout', function($location, $timeout) {
	return function(scope, element, attrs) {
		var navMenu = function() {
			var links = element.find('a'),
			onClass = String(attrs.navMenu) || 'on',
			routePattern,
			link,
			url,
			currentLink,
			urlMap = {},
			i;
			if (!$location.$$html5) {
				routePattern = /^#[^/]*/;
			}
			for (i = 0; i < links.length; i++) {
				link = angular.element(links[i]);
				url = link.attr('href');
				if (!url) continue;
				if ($location.$$html5) {
					urlMap[url] = link;
				} else {
					urlMap[url.replace(routePattern, '')] = link;
				}
			}
			var updateLink = function() {
				var pathLink = urlMap[$location.path()];
				if (pathLink) {
					if (currentLink) {
						currentLink.removeClass(onClass);
					}
					if (pathLink.parents('.dropdown-menu').length) {
						currentLink = jQuery('#'+pathLink.parents('.dropdown-submenu:first').attr('id'));//its because a strange bug
					} else {
						currentLink = jQuery('#'+pathLink.parent().attr('id'));
					}
					currentLink.addClass(onClass);
				}
			}
			updateLink();
			scope.$on('$routeChangeStart', updateLink);
		}
		$timeout(navMenu, 500);
	};
}]);

meumobiDirectives.directive('videoGallery', ['$timeout', function($timeout) {
return {
    restrict: 'EA',
    scope: {
      videos: '='
    },  
    link: function(scope, element, attrs) {
      var prepare = function (container, videos) {
        var data = [];
        angular.forEach(videos, function(video) {
          var item  = {
//            title: "test",
            type: 'text/html',
            href: video.src
          };
          item[video.source] = video.videoId;
          data.push(item);
        });
         console.log(data);
        blueimp.Gallery(data, {
          container: container,
          startSlideshow: false,
          //slideshowInterval: 50000,
          carousel: true
        }); 
      };
      scope.$watch('videos', function(data) {// needed because the geolocation promise
        if (data instanceof Array && data.length > 0)
          $timeout(function() {
            prepare(element[0], data);
          }, 0);
          
      }); 
    }   
  };  
}]);

