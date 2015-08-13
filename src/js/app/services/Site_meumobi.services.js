(function() {
	'use strict';

	angular
	.module('meumobi.services.Site', ['ngResource', 'meumobiSettings', 'http-with-fallback'])
	.factory('SiteService', SiteService);
		
	function SiteService(httpWithFallback, CONFIG, APP, Settings) {
		var service = {};
		
		service.getPerformance = getPerformance;
 
		return service;
		
		function getPerformance() {
			return httpWithFallback.get(Settings.getSiteBuilderApiUrl() + '/performance', {timeout: CONFIG.HTTP.timeout})
			.then(getPerformanceComplete)
			.catch(getPerformanceFailed);
			
			function getPerformanceComplete(response) {
				return response.data;
			}
			
			function getPerformanceFailed(error) {
				return null;
			}
		}
	}
})();