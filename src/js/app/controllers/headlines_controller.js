(function() {
	'use strict';

	angular
	.module('meumobiApp')
	.controller('HeadlinesController', HeadlinesController);

	function HeadlinesController(Site, Categories, $rootScope, meumobiSite) {

		var vm = this;
		var data = {};

		activate();
		
		// Handle Reload
		$rootScope.$on('reload', activate);

		function activate() {

			return getCategories().then(function() {
				angular.forEach(vm.categories, function(category, index) {
					Categories.items(category.id,{page:1, order: 'published,DESC'})
					.then(function(response) {
						fulfill(response, category.id, index);
					});
				})
			});
		}

		function fulfill(response, category_id, index) {
			updateHeadlines(response, category_id, index);
			// if we have a promise, we will use the same current function when it is fulfilled
			if (response.promise) response.promise.then(function(response) {
				fulfill(response, category_id, index);
			});
		}

		function updateHeadlines(response, category_id, key) {
			vm.headlines[key] = response.data;
			
			return vm.headlines;
		}
		
		function getCategories() {
			return meumobiSite.getWebAppData()
			.then(function(response) {
				data.categories = meumobiSite.getCategoriesTree(response.data.categories);
				data.site = response.data.site;
				var coverPath = response.data.site.photos[0] ? response.data.site.photos[0].path : null;
				data.cover = coverPath ? meumobiSite.getAssetUrl(coverPath) : coverPath;
				data.headlines = {};
				
				angular.copy(data, vm);
			})
			.catch(function(response) {
				console.log(response);
			})
		}
	}
	
	function chunk(arr, size) {
		var newArr = [];
		for (var i=0; i<arr.length; i+=size) {
			newArr.push(arr.slice(i, i+size));
		}
		return newArr;
	}

	// vm.chunkedData = chunk(vm.headlines.slice(1), 2);
	
})();