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

  /**
  * Download file to local folder.
  */
  $scope.downloadFile = function (media, $event) {
    if (!IS_APP) {
      return window.open(media.url,'_blank');
    }
    if ($event.target.disabled) { return; }
    var localDir;
    if (device.platform.toLowerCase() == "android") {
        localDir = cordova.file.externalRootDirectory + "/Downloads";
    } else {
        localDir = cordova.file.dataDirectory;
    }
    $event.target.disabled = true;
    var html = $event.target.innerHTML;
    $event.target.innerHTML = translateFilter('Downloading') + '...';
    var extension = media.type.split('/')[1];
    var fileName = md5(media.title) + '.' + extension;
    var localPath = localDir + '/' + fileName;
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(media.url);
    fileTransfer.download(uri, localPath, function(entry) {
      console.log(entry);
      localStorage[fileName] = media.title;
      localStorage[fileName+"type"] = media.type;
      window.plugins.toast.showShortBottom(translateFilter('Download finished'));
      $event.target.innerHTML = translateFilter('Download finished');
    }, function(error) {
      console.log(error);
      window.plugins.toast.showShortBottom(translateFilter('Download failed'));
      $event.target.innerHTML = html;
      $event.target.disabled = false;
    }, false);
  }

  Items.load($routeParams.id).then(fulfill);
});

