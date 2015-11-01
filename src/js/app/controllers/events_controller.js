(function() {
	'use strict';

	angular
	.module('meumobiApp')
	.controller('EventsController', EventsController);

	function EventsController(Site, Categories, $rootScope, meumobiSite, $routeParams, UtilsService) {

		var vm = this;
		vm.items = {};
		//vm.category = [];
		vm.site = {};
		vm.addEvent = function(item) {
			UtilsService.addEvent2Calendar(item);
		};
		vm.currentPage = $routeParams.page ? $routeParams.page : 1;//set current pagination page

		activate();

		// Handle Reload
		$rootScope.$on('reloadData', activate);

		function activate() {
			vm.items = {};
			meumobiSite
				.getCategory($routeParams.id)
				.then(function(category) {
					vm.category = category;
				})
			vm.site = {};

			Categories.items($routeParams.id, {page: vm.currentPage, order: 'start_date,DESC'})
			.then(function(response){
				fulfill(response)
			})
			.catch(function(response) {
				console.log(response);
			})
		}

		function fulfill(response) {
			vm.items = response.data.items;
			// if we have a promise, we will use the same current function when it is fulfilled
			if (response.promise) response.promise.then(function(response) {
				fulfill(response);
			});
		}
	}
})();