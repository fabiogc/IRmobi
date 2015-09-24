angular.module('meumobiControllers').controller('ItemShowCtrl', function($scope, $sce, Items, Categories, $routeParams, translateFilter,IS_APP, UtilsService) {
  var fulfill = function(response) {
    var item = response.data;
    Categories.load(item.parent_id).then(function(data) {
      $scope.category = data;
    });
    //get social medias(youtube, vimeo etc), maybe better put this in the service
    var socialVideoPlaylist = [];
    var i = item.medias.length;
    while(i--) {
      var media = item.medias[i];
      if (isSocialVideoUrl(media.url)) {
        media.url = $sce.trustAsResourceUrl(media.url);
        socialVideoPlaylist.push(media);
        delete item.medias[i];
      }
    }
    $scope.socialVideoPlaylist = socialVideoPlaylist;
    console.log('social videols');
    console.log(JSON.stringify(socialVideoPlaylist));
    $scope.item = item;
		hasAudio($scope.item);
		hasVideo($scope.item);
    if (response.promise) response.promise.then(fulfill);
  };

  Items.load($routeParams.id).then(fulfill);
	
	$scope.getTrustedResourceUrl = function(src) {
		return $sce.trustAsResourceUrl(src);
	}

	function findMediasByTypes(medias, types) {
		var results = [];
		for (var i = 0; i < medias.length; i++) {
			if (types.indexOf(medias[i].type) > -1) {
				results.push(medias[i]);
			}
		}
		return results;
	}

	$scope.shareFeed = function(item) {
		UtilsService.shareFeed(item);
	};
	
	$scope.audio = {};
	$scope.video = {};

	function hasAudio(item) {
		var medias = findMediasByTypes(item.medias, ["audio/mpeg", "audio/mp3"])
		if (medias.length > 0) {
			$scope.audio = medias[0];
		}
		return ($scope.audio.length > 0)
	}
	
	function hasVideo(item) {
		var medias = findMediasByTypes(item.medias, ["video/mpeg", "video/mp4"])
		if (medias.length > 0) {
			$scope.video = medias[0];
		}
		return ($scope.video.length > 0)
	}
});

