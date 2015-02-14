meumobiServices.provider('files', function(IS_APP) {
  var fileTransfers = {};
  var files = {};
  var config = {
    path: "/Downloads/rimobi"
  }

  /**
   * setup service
   */
  this.setup = function(params) {
    angular.extend(config, params);
  };

  /**
   * service
   */
  this.$get = function($q, $rootScope,translateFilter) {
    var api = {};
    var localDir;
    api.getLocalDir = function() {
      if (localDir) return localDir;
      if (device.platform.toLowerCase() == "android") {
        localDir = cordova.file.externalRootDirectory + config.path;
      } else {
        localDir = cordova.file.dataDirectory;
      }
      return localDir;
    }
    api.getLocalPath = function(fileName) {
      console.log(api.getLocalDir());
      return api.getLocalDir() + '/' + fileName;
    }
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
    api.loadFile = function (path) {
      var deferred = $q.defer();
      console.log(path);
      window.resolveLocalFileSystemURL(path, function(entry) {
        deferred.resolve(entry);
      },
      function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    /**
     * Service public methods
     */
    return {
      download: function(media) {
        console.log('Donwload');
        console.log(media)
        var deferred = $q.defer();
        var fileName = this.fileName(media);
        var uri = encodeURI(media.url);
        console.log(uri);
        //DEBUG
        //deferred.resolve();
        //return deferred.promise;

        var fileTransfer = new FileTransfer();
        fileTransfers[fileName] = fileTransfer;
        fileTransfer.onprogress = function(e) {
          $rootScope.$emit(fileName+'.progress', e);
        }; 

        /**
         * Download file to local folder.
         */
        console.log(api.getLocalPath(fileName));
        fileTransfer.download(uri, api.getLocalPath(fileName), function(entry) {
          console.log(JSON.stringify(entry));
          var file = {
            title: media.title,
            type: media.type,
            path: entry.nativeURL
          };
          api.addFile(fileName, file);
          delete fileTransfers[fileName];
          console.log('after finish');
          $rootScope.$emit(fileName + '.finish', file);
          deferred.resolve(file);
        }, function(error) {
          console.log(JSON.stringify(error));
          delete fileTransfers[fileName];
          $rootScope.$emit(fileName + 'error', error);
          deferred.reject(error);
        }, false);

        return deferred.promise;
      },
      fileName: function(file) {
        var extension = file.type.split('/')[1];
        return md5(file.title) + '.' + extension;
      },
      isDownloaded: function(file) {
        var fileName = this.fileName(file);
        return !!api.files()[fileName];
      },
      isDownloading: function(file) {
        var fileName = this.fileName(file);
        return !!fileTransfers[fileName];     
      },
      list: function() {
        return api.files();
      },
      get: function(file) {
        var fileName = this.fileName(file);
        return api.files()[fileName];
      },
      open: function(file) {
        console.log("Path: " + file.path);
        console.log("Type: " + file.type);
        cordova.plugins.fileOpener2.open(file.path, file.type);
      },
      remove: function(file) {
        var deferred = $q.defer();
        var fileName = this.fileName(file);
        api.loadFile(file.path).then(function(entry) {
          entry.remove(function (file) {
            console.log("File removed!");
            api.removeFile(fileName);
            deferred.resolve();
          },function (error) {
            console.log("error deleting the file " + error.code);
            deferred.reject(error);
          },function (error) {
            console.log("file does not exist");
            deferred.reject(error);
          });
        }, function() {
          //file not exists, 
          console.log("File not exist");
          api.removeFile(fileName);
          deferred.resolve();
        });
        return deferred.promise;
      }
    };
  };
});
