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
		templateUrl: '/themes/rimobi/partials/utils/pagination.html',
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
}]);