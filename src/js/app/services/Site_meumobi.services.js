(function() {
	'use strict';

	angular
	.module('meumobi.services.Site', [])
	.factory('SiteService', SiteService);
		
	function SiteService(httpWithFallback, CONFIG, APP, Settings, UtilsService) {
		var service = {};
		
		service.getPerformance = getPerformance;
		// service.getPhotos = getPhotos;
		service.getLogo = getLogo;
 
		return service;
		
		function getLogoPath() {
			var performance = JSON.parse(localStorage.performance)
			return performance.site.logo;
		}
		
		function getLogo() {
			var path = getLogoPath();
			return localStorage[path];
		}
		
    function saveImage(path, domain) {
			console.log("Canvas: " + domain + path);
			//console.log(UtilsService);
      UtilsService.createBase64Image(domain+path, function(img64) {
        localStorage[path] = img64;
      });
    }
		
    function saveAllImages(imagesUrls, callback) {
      var imagesToSave = imagesUrls.length,
        totalImages = imagesToSave - 1;
      while (imagesToSave--) {
        //can't save all the images. the 5MB limit has been exceeded
        //app.saveImage(imagesUrls[imagesToSave],function(imageId, img64){
        //totalImages--;
        //if(imagesToSave == totalImages){
        callback();
        //}
        //});
      }
    }
		
    function deleteImages() {
      for (prop in localStorage) {
        if (prop.indexOf('image_') != -1) {
          delete localStorage[prop];
        }
      }
    }
		
		function getPerformance() {
			return httpWithFallback.get(Settings.getSiteBuilderApiUrl() + '/performance', {timeout: CONFIG.HTTP.timeout})
			.then(getPerformanceComplete)
			.catch(getPerformanceFailed);
			
			function getPerformanceComplete(response) {
				localStorage.performance = JSON.stringify(response.data);
				console.log("Save Logo: " + getLogoPath())
				saveImage(getLogoPath(), APP.cdnUrl);
				return response.data;
			}
			
			function getPerformanceFailed(error) {
				return null;
			}
		}
	}
})();