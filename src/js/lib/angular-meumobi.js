(function() {
	'use strict';
	
	angular
	.module('meumobi.services.meumobiSite', [])
	.provider('meumobiSite', meumobiSiteProvider);
	
	function meumobiSiteProvider() {
		var currentLanguage = "pt";
		var currentCategories = null;

		this.cdnUrl = "";
		this.apiUrl = "";
		this.domains = "";
		this.httpTimeout = "10000";

		this.$get = meumobiSite;
		
		function meumobiSite($http, httpWithFallback) {
			var that = this;
			
			var service = {}
		
			service.getSiteBuilderApiUrl = getSiteBuilderApiUrl;
			service.getAssetUrl = getAssetUrl;
			service.getAvailableLanguages = getAvailableLanguages;
			service.getCurrentLanguage = getCurrentLanguage;
			service.setCurrentLanguage = setCurrentLanguage;
			service.getCategoriesTree = getCategoriesTree;
			service.apiRequest = apiRequest;
			service.performance = performance;
			
			service.cdnUrl = that.cdnUrl;
			service.apiUrl = that.apiUrl;
			service.domains = that.domains;
			service.httpTimeout = that.httpTimeout;

			return service;

			function getSiteBuilderApiUrl(path) {
				return that.apiUrl + that.domains[currentLanguage] + path;
			}
			
			function getAssetUrl(path) {
				return that.cdnUrl + path;
			}
			
			function getAvailableLanguages() {
				return Object.keys(that.domains);
			}
			
			function getCurrentLanguage() {
				return currentLanguage;
			}
			
			function setCurrentLanguage(lang) {
				localStorage.language = lang;
				currentLanguage = lang;
			}
			
			function saveCategories(categories) {
				for (c in categories) {
					//
				}
				//localStorage.setItem("categories") = ;
			}
			
			function getCategoriesTree(categories) {
				var children = [];
				children[0] = [];
				for(var key in categories) {
					var parent_id = categories[key].parent_id != null ? categories[key].parent_id : 0;
					if (!children[parent_id])
						children[parent_id] = [];
					children[parent_id].push(categories[key]);
				}
				for(var key in categories) {
					var category = categories[key];
					category.children = [];
					if (children[category.id])
						category.children = children[category.id];
				}
				return children[0];
			}
			
			function apiRequest(path) {
				return httpWithFallback.get(getSiteBuilderApiUrl(path), {timeout: that.httpTimeout})
			}
			
			function performance() {
				//return $http.get(getSiteBuilderApiUrl() + '/performance', {timeout: that.httpTimeout});
				return httpWithFallback.get(getSiteBuilderApiUrl("/performance"), {timeout: that.httpTimeout});
			}
		}
	};
})();
