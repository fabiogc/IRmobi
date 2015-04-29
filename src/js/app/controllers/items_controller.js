angular.module('meumobiControllers').controller('ItemShowCtrl', function($scope, $sce, Items, Categories, $routeParams, translateFilter,IS_APP) {
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
    if (response.promise) response.promise.then(fulfill);
  };

  Items.load($routeParams.id).then(fulfill);
});

