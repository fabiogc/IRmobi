(function() {
	'use strict';

	angular
	.module('meumobiApp')
	.controller('MainController', MainController);

	function MainController($scope, $rootScope, Settings, Site, Categories, APP) {

		var vm = this;
		vm.categories = [];
		vm.site = null;
		
		activate();

		//Select language and reload the site
		$scope.setLanguage = function(language) {
			console.log('set language to ' + language);
			if (Settings.getLanguage() != language ) {
				Settings.setLanguage(language);
				activate();
				$rootScope.reload();
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
	}
})();
