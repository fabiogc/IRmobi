(function() {
	'use strict';

	angular
	.module('meumobiApp')
	.controller('MainController', MainController);

	function MainController($scope, $location, $rootScope, $translate, SiteService, LanguageService, meumobiSite, UtilsService) {

		var vm = this;
		//vm.categories = [];
		//vm.site = null;
		
		activate();
		$translate.use(LanguageService.getLanguage());
		//Select language and reload the site
		$scope.setLanguage = function(language) {
			console.log("Click to select language: " + language);
			if (LanguageService.getLanguage() != language ) {
				LanguageService.setLanguage(language);
				meumobiSite.setLanguage(language);
				meumobiSite.resetWebApp();
				activate();
				$rootScope.reload();
				console.log("Use language: " + language);
				$translate.use(language);
				$location.path('/');
			}
		}
		
		function activate() {
			$scope.languages = LanguageService.getAvailableLanguages();
			meumobiSite.getWebAppData()
			.then(function(response) {
				fulfill(response);
			})
			.catch(function(response) {
			})
		}

		function fulfill(response) {
			updateDatas(response);
			// if we have a promise, we will use the same current function when it is fulfilled
			if (response.promise) {
				response.promise
					.then(function(response) {
						fulfill(response);
					})
					.catch(function(response) {
					})
			}
		}

		function updateDatas(response) {
			var data = {};

			data.categories = meumobiSite.getCategoriesTree(response.data.categories);
			data.site = response.data.site;
			data.business = response.data.business;
			data.logo = meumobiSite.getAssetUrl(data.site.logo);

			angular.copy(data, vm);
		}
	}
})();
