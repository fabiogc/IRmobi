(function() {
	'use strict';

	angular
	.module('meumobi.directives.Headlines', [])
	.directive('articleHeadlines', articleHeadlines)

	function articleHeadlines() {
		return {
			restrict: 'E',
			scope: {
				items: '=',
				category: '='
			},
			templateUrl: 'articles/headlines.html',
			link: function(scope, element, attrs) {
				scope.limit = attrs.limit;
			}
		};
	}
})();