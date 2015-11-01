(function() {
	'use strict';

	angular
	.module('meumobiApp')
	.controller('StockController', StockController)

	function StockController(StockService, meumobiSite) {

		var vm = this;
		vm.quotes = null;
		
		meumobiSite.getWebAppData()
		.then(function(response) {
			var code = response.data.site.stock_symbols;
			if ( code != "") {
				updateData(code);
			}
		})
		.catch(function(response) {
		})

		function updateData(code) {
			return StockService.getQuotes(code)
			.then(function(data) {
				vm.quotes = data;
				return vm.quotes;
			});
		}
	}
})();