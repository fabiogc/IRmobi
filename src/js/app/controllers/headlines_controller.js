(function() {
	'use strict';

	angular
	.module('meumobiApp')
	.controller('HeadlinesController', HeadlinesController);

	function HeadlinesController(Site, Categories, $rootScope) {

		var vm = this;
		vm.headlines = [];
		vm.categories = [];

		activate();

		// Handle Reload
		$rootScope.$on('reloadData', activate);

		function activate() {
			return getCategories().then(function() {
				angular.forEach(vm.categories, function(category, index) {
					getHeadlines(category.id).then(function() {

					});
				})
			});
		}

		function getHeadlines(category_id) {
			return Categories.items(category_id,{page:1})
			.then(function(response) {
				vm.headlines.push(response.data);
				return vm.headlines;
			});
		}

		function getCategories() {
			return Site.get()
			.then(function(response) {
				vm.categories = Categories.getTree(response.data.categories);
				return vm.categories;
			});
		}
	}
	

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