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
		templateUrl: 'themes/rimobi/partials/categories/headlines.html',
		link: function(scope) {
			scope.template = 'themes/rimobi/partials/'+scope.category.type+'/headlines.html';
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
		templateUrl: 'themes/rimobi/partials/utils/breadcrumb.html'
	};
});

meumobiDirectives.directive('stock', ['Stock', function(Stock) {
	return {
		restrict: 'E',
		scope: {code: '='},
		template: '<ng-include src="templatePath"></ng-include>',
		link: function(scope) {
			console.log(scope.code);
			Stock.getQuotes(scope.code).then(function(data) {
				console.log(data);
				var quotes = data.query.results.quote;
				if (quotes.length >=4) {
					scope.quotes = quotes;
					scope.mainQuote = quotes.shift();
					scope.templatePath = 'themes/rimobi/partials/widgets/stock/multi-quotes.html';
				} else {
					var first = quotes.shift();
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
