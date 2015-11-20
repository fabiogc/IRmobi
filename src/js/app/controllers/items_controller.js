(function() {
	'use strict';

	angular
	.module('meumobiApp')
	.controller('ItemsShowController', ItemsShowController)
	.controller('ItemsListController', ItemsListController)

	function ItemsListController($scope, Categories, $rootScope, meumobiSite, $routeParams) {
		var vm = this;

		vm.currentPage = $routeParams.page ? $routeParams.page : 1;//set current pagination page

		activate();

		// Handle Reload
		$rootScope.$on('reloadData', activate);

		function activate() {
			vm.items = {};
			meumobiSite
			.getCategory($routeParams.id)
			.then(function(category) {
				vm.category = category;
			})

			Categories.items($routeParams.id, {page: vm.currentPage, order: 'published,DESC'})
			.then(function(response){
				fulfill(response)
			})
			.catch(function(response) {
				console.log(response);
			})
		}

		function fulfill(response) {
			vm.items = response.data.items;
			// if we have a promise, we will use the same current function when it is fulfilled
			if (response.promise) response.promise.then(function(response) {
				fulfill(response);
			});
		}
	}

	function ItemsShowController($scope, $sce, meumobiSite, $routeParams, UtilsService) {

		var vm = this;
		var socialVideoPlaylist = [];
		
		var allowedTypes = ['application/pdf','text/html', 'audio/mpeg', 'application/vnd.ms-excel', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

		activate();

		function getCategory(id) {
			meumobiSite
				.getCategory(id)
				.then(function(category) {
					vm.category = category;
				})
		}

		function getSocialVideos(item) {
	    var i = item.medias.length;
	    while(i--) {
	      var media = item.medias[i];
	      if (isSocialVideoUrl(media.url)) {
	        media.url = $sce.trustAsResourceUrl(media.url);
	        socialVideoPlaylist.push(media);
	        delete item.medias[i];
	      }
	    }
			vm.socialVideoPlaylist = socialVideoPlaylist;
		}

		function activate() {
			meumobiSite
				.getSelectedItem()
				.then(function(item) {
					vm.item = item;
					vm.media = item.medias;
					getCategory(item.parent_id);
					getSocialVideos(item);
					hasAudio(item);
					hasVideo(item);
				})
		}

		$scope.getTrustedResourceUrl = function(src) {
			return $sce.trustAsResourceUrl(src);
		}

		function findMediasByTypes(media, types) {
			var results = [];
			for (var i = 0; i < media.length; i++) {
				if (types.indexOf(media[i].type) > -1) {
					results.push(media[i]);
				}
			}
			return results;
		}

		$scope.shareItem = function(item) {
			UtilsService.shareItem(item);
		};
	
		vm.audio = {};
		vm.video = {};

		function hasAudio(item) {
			var medias = findMediasByTypes(item.medias, ["audio/mpeg", "audio/mp3"])
			if (medias.length > 0) {
				vm.audio = medias[0];
			}
			return (vm.audio.length > 0)
		}
	
		function hasVideo(item) {
			var medias = findMediasByTypes(item.medias, ["video/mpeg", "video/mp4"])
			if (medias.length > 0) {
				vm.video = medias[0];
			}
			return (vm.video.length > 0)
		}
	}
})();