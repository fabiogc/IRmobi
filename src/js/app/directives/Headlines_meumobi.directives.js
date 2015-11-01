(function() {
	'use strict';

	angular
	.module('meumobi.directives.Headlines', [])
	.directive('articleHeadlines', articleHeadlines)

	function articleHeadlines($rootScope) {
		return {
			restrict: 'E',
			scope: {
				items: '=',
				category: '=',
				goToItem: '='
			},
			controller: function($scope, $element,$rootScope) {},
			templateUrl: 'articles/headlines.html',
			link: function(scope, element, attrs) {
				scope.limit = attrs.limit;
				scope.goToItem = $rootScope.goToItem;
			}
		};
	}
})();