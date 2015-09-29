(function() {
	'use strict';

	angular
	.module('meumobiApp')
	.controller('MainController', MainController);

	function MainController($scope, $location, $rootScope, $translate, SiteService, LanguageService, meumobiSite) {

		var vm = this;
		vm.categories = [];
		vm.site = null;
		
		activate();
		$translate.use(meumobiSite.getCurrentLanguage());
		//Select language and reload the site
		$scope.setLanguage = function(language) {
			console.log("Click to select language: " + language);
			if (meumobiSite.getCurrentLanguage() != language ) {
				meumobiSite.setCurrentLanguage(language);
				activate();
				$rootScope.reload();
				$location.path('/');
				$translate.use(language);
			}
		}
		
		function activate() {
			$scope.languages = LanguageService.getAvailableLanguages();
			meumobiSite.performance()
			.then(function(response) {
				// Check if logo exists and save it
				if (response.data.logo != undefined) {
					UtilsService.saveImage(response.data.logo, meumobiSite.cdnUrl);
				}
				vm.categories = meumobiSite.getCategoriesTree(response.data.categories);
				vm.site = response.data.site;
			})
			.catch(function(response) {
				console.log(response);
			})
		}
	}
})();
