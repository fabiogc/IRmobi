meumobiControllers.controller('ItemShowCtrl', function($scope, $sce, Items, Categories, $routeParams, translateFilter,IS_APP) {
  $scope.mediaFilter = function(media) {
  var allowed = ['application/pdf','text/html', 'audio/mpeg'];
  var allow = (allowed.indexOf(media.type) != -1);
  if (media.type == 'text/html' && isSocialVideoUrl(media.url))
    allow = false;
    return allow;
  };

  var fulfill = function(response) {
    var item = response.data;
    Categories.load(item.parent_id).then(function(data) {
      $scope.category = data;
    });
    $scope.audioPlaylist = Items.getMedias(item, 'audio');
    $scope.videoPlaylist = Items.getMedias(item, 'video');
    $scope.socialVideoPlaylist = Items.getMedias(item, function(media) {
      return isSocialVideoUrl(media.url);
    }).map(function(media) {
      media.url = $sce.trustAsResourceUrl(media.url); //fix error:insecurl
      return media;
    });
    $scope.item = item;
    if (response.promise) response.promise.then(fulfill);
  };


  Items.load($routeParams.id).then(fulfill);
});

