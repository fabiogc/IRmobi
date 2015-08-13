(function() {
	'use strict';

	angular
	.module('meumobiApp')
	.controller('MainController', MainController);

	function MainController($scope, $location, $rootScope, Settings, Site, Categories, APP) {

		var vm = this;
		vm.categories = [];
		vm.site = null;
		
		activate();

		//Select language and reload the site
		$scope.setLanguage = function(language) {
			if (Settings.getLanguage() != language ) {
				Settings.setLanguage(language);
				activate();
				$rootScope.reload();
				$location.path('/');
			}
		}
		
		function activate() {
			$scope.languages = Settings.getAvailableLanguages();
			return getSite().then(function() {
				
			});
		}

		function getSite() {
			return Site.get()
			.then(function(response) {
				getCategories(response);
				vm.site = response.data.site;
				return vm.site;
			});
		}

		function getCategories(response) {
			vm.categories = Categories.getTree(response.data.categories);
			console.log(vm.categories);
			return vm.categories;
		}
	}
})();
