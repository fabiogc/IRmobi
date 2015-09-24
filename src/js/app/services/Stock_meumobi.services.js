(function() {
	'use strict';

	angular
	.module('meumobi.services.Stock', [])
	.factory('StockService', StockService);
		
	function StockService($http, CONFIG, APP) {
		var service = {};
		
		service.getQuotes = getQuotes;
 
		return service;
		
		function getQuotes(code) {

			var params = {};
			if (code.indexOf(':') === 0) {//is profile
				params.action = 'enfoquify';
				params.profile = code.substring(1);
			} else {
				params.action = 'yahoofy';
				params.codes = code;
			}

			return $http.get(APP.stocksUrl, {timeout: CONFIG.HTTP.timeout, params: params})
			.then(getQuotesComplete)
			.catch(getQuotesFailed);
			
			function getQuotesComplete(response) {
				return response.data.query.results.quote;
			}
			
			function getQuotesFailed(error) {
				
			}
		}
	}
})();