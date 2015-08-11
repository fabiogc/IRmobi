(function() {
	'use strict';

	angular
	.module('meumobiApp')
	.controller('StockController', StockController)
	.service('meumobiSiteService', meumobiSiteService)
	
	function meumobiSiteService(Site) {
		var site = this;
		
		site.stock = "CIEL3.SA";
	}

	function StockController(StockService, meumobiSiteService) {

		var vm = this;
		vm.quotes = null;
		var stockCode = meumobiSiteService.stock;
		
		activate(stockCode);
		
		function activate(code) {
			return getQuotes(code).then(function() {
				
			});
		}

		function getQuotes(code) {
			return StockService.getQuotes(code)
			.then(function(data) {
				vm.quotes = data;
				return vm.quotes;
			});
		}
	}
})();