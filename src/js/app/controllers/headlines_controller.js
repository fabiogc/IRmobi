(function() {
	'use strict';

	angular
	.module('meumobiApp')
	.controller('HeadlinesController', HeadlinesController);

	function HeadlinesController(Site, Categories, $rootScope) {

		var vm = this;
		vm.headlines = {};
		vm.categories = [];
		vm.site = {};

		activate();

		// Handle Reload
		$rootScope.$on('reloadData', activate);

		function activate() {
			console.log("reload Headlines");
			vm.headlines = {};
			vm.categories = [];
			vm.site = {};
			return getCategories().then(function() {
				angular.forEach(vm.categories, function(category, index) {
					Categories.items(category.id,{page:1}).then(function(response, promise) {
						// console.log("Index: " + index + ", Category: " + category.id + ", isFallback: " + response.isFallback);
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
			// console.log("Response category: " + category_id + ", isFallback: " + response.isFallback);
			if (key==0) {key = "first";}
			vm.headlines[key] = response.data;
			return vm.headlines;
		}
		
		function getCategories() {
			return Site.get()
			.then(function(response) {
				vm.categories = Categories.getTree(response.data.categories);
				vm.site = response.data.site;
				return vm.categories;
			});
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

	/*
	localStorage.hasOwnProperty("device")
	localStorage.device = JSON.stringify(device);
	localStorage.removeItem("device");
	var fulfill = function(response) {
	var data = response.data;
	data.categories = Categories.getTree(data.categories);
	var categories = data.categories.slice(0);
	$scope.performance = data;
	if (data.site.stock_symbols) {

	$scope.firstCategory = categories.shift();
	$scope.headlinesRows = 1;
	}
	$scope.splitedCategories = $scope.splitArray(categories, 2);
	if (response.promise) response.promise.then(fulfill);
	};
	var loadData = function() {
	$scope.languages = Settings.getAvailableLanguages();
	Site.get().then(fulfill);
	};
	$scope.$on('reloadData', loadData);//handle reload
	loadData();//first load*/

})();