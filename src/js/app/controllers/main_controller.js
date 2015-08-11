(function() {
	'use strict';

	angular
	.module('meumobiApp')
	.controller('MainController', MainController);

	function MainController($scope, Settings, Site, Categories, APP) {

		var vm = this;
		vm.categories = [];
		vm.site = null;

		activate();
		
		$scope.getImage = function(path){
			return APP.cdnUrl + path;
		}
		
		function activate() {
			return getSite().then(function() {
				
			});
		}

		function getSite() {
			return Site.get()
			.then(function(response) {
				console.log(response);
				getCategories(response);
				vm.site = response.data.site;
				return vm.site;
			});
		}

		function getCategories(response) {
				vm.categories = Categories.getTree(response.data.categories);
				return vm.categories;
		}


    var loadData = function() {
      $scope.languages = Settings.getAvailableLanguages();
			console.log("Reloads");
      // Site.get().then(fulfill);
    };
    $scope.$on('reloadData', loadData);//handle reload
    loadData();//first load
/*
		$scope.userAgent = navigator.userAgent;
		$scope.headlinesRows = 2;
		//change language and reload the site
		$scope.setLanguage = function(language) {
			console.log('set language to ' + language);
			if (Settings.getLanguage() != language ) {
				Settings.setLanguage(language);
				$location.url('/');// got to home
				$timeout(function() {
					$window.location.reload(); // reload page
				},0);
			}
		};*/
	}
})();
