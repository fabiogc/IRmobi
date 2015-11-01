(function() {
	'use strict';
	
	angular
	.module('meumobi.services.meumobiSite', [])
	.provider('meumobiSite', meumobiSiteProvider);
	
	function meumobiSiteProvider() {
		var currentLanguage = "pt";
		var currentCategories = null;
		var selectedItem = null;
		var data = {};
		var meuWebApp = {};

		this.cdnUrl = "";
		this.apiUrl = "";
		this.domains = "";
		this.httpTimeout = "10000";

		this.$get = meumobiSite;
		
		function meumobiSite($exceptionHandler, $q, $http, httpWithFallback) {
			var that = this;

			loadData();
			
			var service = {}
		
			service.getSiteBuilderApiUrl = getSiteBuilderApiUrl;
			service.getAssetUrl = getAssetUrl;
			service.getCategoriesTree = getCategoriesTree;
			service.apiRequest = apiRequest;
			service.performance = performance;
			service.setLanguage = setLanguage;
			
			service.cdnUrl = that.cdnUrl;
			service.apiUrl = that.apiUrl;
			service.domains = that.domains;
			service.httpTimeout = that.httpTimeout;
			service.getWebAppData = getWebAppData;
			service.getCategory = getCategory;
			service.setSelectedItem = setSelectedItem;
			service.getSelectedItem = getSelectedItem;
			service.resetWebApp = resetWebApp;

			return service;
			
			function loadData() {
				meuWebApp.data = httpWithFallback.get(getSiteBuilderApiUrl("/performance"), {timeout: that.httpTimeout});
			}
			
			function setSelectedItem(item) {
				selectedItem = item;
			}
			
			function resetWebApp() {
				meuWebApp = {};
			}
			
			function getSelectedItem() {
				return $q.when(selectedItem);
			}
			
			function getWebAppData() {
				if (meuWebApp.hasOwnProperty(data)) {
					// nothing todo
				} else {
					loadData();
				}
				return meuWebApp.data;
			}
			
			function getCategory(id) {
				try {
					// Check if categories exist on meuWebApp Object
					// If not then id is wrong
					return meuWebApp.data.then(function(response) {
						var categories = response.data.categories;
						for ( var i = 0, length = categories.length ; i < length ; i++ ) {
							if (parseInt(categories[i].id) === parseInt(id)) {
								return categories[i];
							}
						}
						// If we made it this far, something went wrong.
						return ({});
					})
				} catch (meumobiSiteError) {
					$exceptionHandler(meumobiSiteError);
				}
			}
			
			function setLanguage(lang) {
				currentLanguage = lang;
			}

			function getSiteBuilderApiUrl(path) {
				return that.apiUrl + that.domains[currentLanguage] + path;
			}
			
			function getAssetUrl(path) {
				return that.cdnUrl + path;
			}
			
			function getSitePhotos() {
				return that.cdnUrl + path;
			}
			
			// site.photos[0]
			function getCover() {
				
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
				console.log("Api Request : " + path);
				return httpWithFallback.get(getSiteBuilderApiUrl(path), {timeout: that.httpTimeout})
			}
			
			function performance() {
				//return $http.get(getSiteBuilderApiUrl() + '/performance', {timeout: that.httpTimeout});
				return httpWithFallback.get(getSiteBuilderApiUrl("/performance"), {timeout: that.httpTimeout});
			}
		}
	};
})();
