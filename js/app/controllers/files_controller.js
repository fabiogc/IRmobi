meumobiControllers.controller('FilesCtrl', function($scope, files) {

  $scope.openFile = function (file) {
    files.open(file);
  };

  $scope.deleteFile = function (file) {
    file.remove(file);
  };

  $scope.downloadedFiles = files.listDownloaded();
});
