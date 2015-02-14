meumobiControllers.controller('FilesCtrl', function($scope, files) {
  $scope.downloadedFiles = files.list();
  console.log($scope.downloadedFiles);
});
