(function() {
	'use strict';

	angular
	.module('meumobi.services.Site', [])
	.factory('SiteService', SiteService);
		
	function SiteService(httpWithFallback, CONFIG, APP, UtilsService, meumobiSite) {
		var service = {};
		
		service.getPerformance = getPerformance;
		// service.getPhotos = getPhotos;
 
		return service;
		
		function getLogoPath() {
			var performance = JSON.parse(localStorage.performance)
			return performance.site.logo;
		}

		function getPerformance() {
			return httpWithFallback.get(meumobiSite.getSiteBuilderApiUrl() + '/performance', {timeout: CONFIG.HTTP.timeout});
		}
	}
})();