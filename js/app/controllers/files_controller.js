meumobiControllers.controller('FilesCtrl', function($scope, files) {
  $scope.downloadedFiles = files.list();
});
