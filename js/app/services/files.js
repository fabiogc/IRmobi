meumobiServices.provider('files', function() {
  var fileTransfers = {};
  var files = {};
  var entries = {};
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
      if (!Object.keys(files).length && localStorage["files"])
        files = JSON.parse(localStorage["files"]);
      return files;
    }
    //add file to localstorage
    api.addFile = function(id, file) {
      files[id] = file;
      localStorage["files"] = JSON.stringify(files);
    };
    //remove file from localstorage
    api.removeFile = function(id) {
      delete files[id];
      localStorage["files"] = JSON.stringify(files);
    };

    //get files handler
    api.loadDir = function () {
      var localDir;
      var deferred = $q.defer();
      if (device.platform.toLowerCase() == "android") {
        localDir = cordova.file.externalRootDirectory + "/Downloads/rimobi";
      } else {
        localDir = cordova.file.dataDirectory;
      }
      $window.resolveLocalFileSystemURL(localDir, function(dir) {
        deferred.resolve(dir);
      },
      function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    //read files from device directory
    api.loadFile = function(name) {
      var deferred = $q.defer();
      if (entries[name]) {
        deferred.resolve(entries[name]);
        return deferred.promise;
      }
      api.loadDir().then(function(dir) {
        var directoryReader = dir.createReader();
        directoryReader.readEntries(function(items) {
          var i;
          for (i=0; i<items.length; i++) {
            var e = items[i];
            if (e.isFile) {
              entries[e.name] = {
                path: e.nativeURL,
                fileEntry: e
              };
            }
          }
          if (entries[name]) {
            deferred.resolve(entries);
          } else {
            deferred.reject('file not exists');
          }
        }, function(error) {
          deferred.reject(error);
        }); 
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    //service methods
    return {
      download: function(media) {
        var deferred = $q.defer();
        var fileName = api.getFileName(media);
        var localPath = localDir + '/' + fileName;
        var localDir;
        var uri = encodeURI(media.url);
        //DEBUG
        deferred.resolve();
        return deferred.promise;

        var fileTransfer = new FileTransfer();
        fileTransfers[fileName] = fileTransger;
        fileTransfer.onprogress = function(e) {
          console.log(JSON.stringify(e));
          deferred.notify(e);
        }; 

        /**
         * Download file to local folder.
         */
        if (device.platform.toLowerCase() == "android") {
          localDir = cordova.file.externalRootDirectory + config.path;
        } else {
          localDir = cordova.file.dataDirectory;
        }

        fileTransfer.download(uri, localPath, function(entry) {
          console.log(JSON.stringify(entry));
          api.addFile(fileName,{
            title: media.title,
            type: media.type,
            path: entry.nativeURL
          });
          delete fileTransfers[fileName];
          window.plugins.toast.showShortBottom(translateFilter('Download finished'));
          deferred.resolve(entry);
        }, function(error) {
          console.log(JSON.stringify(error));
          delete fileTransfers[fileName];
          window.plugins.toast.showShortBottom(translateFilter('Download failed'));
          deferred.reject(error);
        }, false);

        return deferred.promise;
      },
      isDownloaded: function(file) {
        var fileName = api.getFileName(file);
        return !!api.files()[fileName];
      },
      isDownloading: function(file) {
        var fileName = api.getFileName(file);
        return !!fileTransfers[fileName];     
      },
      list: function() {
        return api.files();
      },
      get: function(file) {
        var fileName = api.getFileName(file);
        api.files()[fileName];
      },
      open: function(file) {
        console.log("Path: " + file.path);
        console.log("Type: " + file.type);
        cordova.plugins.fileOpener2.open(file.path, file.type);
      },
      remove: function(file) {
        var deferred = $q.defer();
        var fileName = api.getFileName(file);
        var shouldDelete = $window.confirm(translateFilter("You want to remove the file?"));
        if (!shouldDelete) { return; }
        api.loadFile(fileName).then(function(entry) {
          entry.remove(function (file) {
            console.log("File removed!");
            api.removeFile(fileName);
            deferred.resolve();
          },function (error) {
            $window.alert(translateFilter("Error removing the file."));
            console.log("error deleting the file " + error.code);
            deferred.reject(error);
          },function (error) {
            $window.alert(translateFilter("This file does not exists."));
            console.log("file does not exist");
            deferred.reject(error);
          });
        }, function() {
          //file not exists, 
          console.log("File removed!");
          api.removeFile(fileName);
          deferred.resolve();
        });
        return deferred.promise;
      }
    };
  };
});
