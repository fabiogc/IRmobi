(function() {
	'use strict';

	angular
	.module('meumobi.directives.Stock', [])
	.directive('singleQuote', singleQuote)
	.directive('multiQuotes', multiQuotes)

	function singleQuote() {
		return {
			restrict: 'E',
			scope: {quotes: '='},
			templateUrl: 'widgets/stock/single-quote.html',
			link: function(scope, element, attrs) {
				scope.source = attrs.source;
			}
		};
	}
	
	function multiQuotes() {
		return {
			restrict: 'E',
			scope: {quotes: '='},
			templateUrl: 'widgets/stock/multi-quotes.html',
			link: function(scope, element, attrs) {
				scope.source = attrs.source;
			}
		};
	}
})();