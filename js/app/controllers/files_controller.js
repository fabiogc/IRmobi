meumobiControllers.controller('FilesCtrl', function($rootScope, $scope, $window, translateFilter) {
  /**
   * Read all entries (files or dirs) of a given directory.
   */
  $scope.readLocalDir = function (dir) {
    var directoryReader = dir.createReader();
    directoryReader.readEntries(function(entries) {
      var i;
      var files = [];
      for (i=0; i<entries.length; i++) {
        var e = entries[i];
        if (e.isFile) {
          var fname = localStorage[e.name];
          if (!fname) { fname = e.name; }
          files.push({
            name: fname,
            path: e.nativeURL,
            type: localStorage[e.name+"type"],
            fileEntry: e
          });
        }
      }
      $scope.$apply(function () {
        $scope.downloadedFiles = files;
      });
    }, function (error) {
      console.log(error.code);
    });
  };

  /**
   * Error handler of resolveLocalFileSystemURL.
   */
  $scope.errorHandler = function (e) {
    console.log(e);
  };

  /**
   * Access the data directory.
   */
  $scope.resolveFileSystem = function () {
    var localDir;
    if (device.platform.toLowerCase() == "android") {
      localDir = cordova.file.externalRootDirectory + "Downloads";
    } else {
      localDir = cordova.file.dataDirectory;
    }
    $window.resolveLocalFileSystemURL(
      localDir, 
      $scope.readLocalDir,
      $scope.errorHandler
    );
  };

  /**
   * Open file.
   */
  $scope.openFile = function (file) {
    console.log("Path: " + file.path);
    console.log("Type: " + file.type);
    cordova.plugins.fileOpener2.open(file.path, file.type);
  };

  /**
   * Delete file.
   */
  $scope.deleteFile = function (file) {
    var shouldDelete = $window.confirm(translateFilter("You want to remove the file?"));
    if (!shouldDelete) { return; }
    file.fileEntry.remove(function (file) {
      console.log("File removed!");
      $scope.resolveFileSystem();
    },function () {
      $window.alert(translateFilter("Error removing the file."));
      console.log("error deleting the file " + error.code);
    },function () {
      $window.alert(translateFilter("This file does not exists."));
      $scope.resolveFileSystem();
      console.log("file does not exist");
    });
  };

  $scope.resolveFileSystem();
});
