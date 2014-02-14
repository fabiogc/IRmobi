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
		templateUrl: '/themes/santander/partials/pagination.html',
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
		templateUrl: function (tElement, tAttrs) {
			return '/themes/santander/partials/articles/headlines.html';
		},
		link: function(scope) {
			Categories.items({id: scope.category.id, page:1}, function(data){
				scope.items = data.items;
		    });
		}
	};
}]);