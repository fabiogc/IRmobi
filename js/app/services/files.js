meumobiServices.provider('files', function() {
  var fileTranfers = {};
  var config = {
    path: "/Downloads/rimobi",
  }
  this.setup = function(params) {
    angular.extend(config, params);
  };

  this.$get = function($q, translateFilter) {
    var api = {};
    api.getFileName = function(media) {
        var extension = media.type.split('/')[1];
        return md5(media.title) + '.' + extension;
    };
    //get localstorage list
    api.files = function() {
      if (localStorage["files"])
        return JSON.parse(localStorage["names"]);
      return {};
    }
    //add to localstorage list
    api.addFile = function(id, file) {
      var files = api.files();
      files[id] = file;
      localStorage["files"] = JSON.stringify(files);
    };

    api.removeFile = function(id) {
      var files = api.files();
      delete files[id];
      localStorage["files"] = JSON.stringify(files);
    };
    //service methods
    return {
      download: function(media) {
        var deferred = $q.defer();
        var fileName = getFileName(media);
        var localPath = localDir + '/' + fileName;
        var fileTransfer = new FileTransfer();
        var uri = encodeURI(media.url);

        fileTransfers[fileName] = fileTransger;

        api.addFile(filename,{
          title: media.title,
          type: media.type
        });
        /**
         * Download file to local folder.
         */
        if (device.platform.toLowerCase() == "android") {
          localDir = cordova.file.externalRootDirectory + config.path;
        } else {
          localDir = cordova.file.dataDirectory;
        }

        fileTransfer.onprogress = function(e) {
          console.log(JSON.stringify(e));
          deferred.notify(e);
        }; 

        fileTransfer.download(uri, localPath, function(entry) {
          console.log(JSON.stringify(entry));
          window.plugins.toast.showShortBottom(translateFilter('Download finished'));
          deferred.resolve(entry);
        }, function(error) {
          console.log(JSON.stringify(error));
          api.removeFile(fileName);
          window.plugins.toast.showShortBottom(translateFilter('Download failed'));
          deferred.reject(error);
        }, false);

        return deferred.promise;
      },
      isDownloaded: function(media) {
        var fileName = getFileName(media);
        return (!fileTransfers[fileName] && localStorage[fileName]);
      },
      isDownloading: function(media) {
         var fileName = getFileName(media);
         return (fileTransfers[fileName] && localStorage[fileName]);     
      },
      listDownloaded: function() {
        var items = [];
        var files = api.files();
        for (var id in ) {
          if (!fileTransfers[id])
            items.push(files[id]);
        }
        return files;
      },
      listDownloading:  function() {
        var items = [];
        var files = api.files();
        for (var id in ) {
          if (fileTransfers[id])
            items.push(files[id]);
        }
        return files;
      },
      open: function(file) {
        console.log("Path: " + file.path);
        console.log("Type: " + file.type);
        cordova.plugins.fileOpener2.open(file.path, file.type);
      },
      remove: function(file) {
        var deferred = $q.defer();
        var filename = file.name;
        var shouldDelete = $window.confirm(translateFilter("You want to remove the file?"));
        if (!shouldDelete) { return; }
        file.fileEntry.remove(function (file) {
          console.log("File removed!");
          api.removeFile(filename);
          deferred.resolve();
        },function (error)
          $window.alert(translateFilter("Error removing the file."));
          console.log("error deleting the file " + error.code);
          deferred.reject(error);
        },function (error) {
          $window.alert(translateFilter("This file does not exists."));
          console.log("file does not exist");
          deferred.reject(error);
        });
        return deferred.promise;
      }
    };
  });
});
