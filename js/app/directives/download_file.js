meumobiDirectives.directive('downloadFile', function($rootScope, translateFilter, files, $timeout, $window, IS_APP, ALLOWED_DOWNLOAD_MEDIAS) {
	return {
		restrict: 'E',
		scope: {
      file: '='
		},
		templateUrl: 'themes/rimobi/partials/utils/download_file.html',
    link: function(scope) {
      //use a simple link if not on app or file not allowed for download
      if (!IS_APP || ALLOWED_DOWNLOAD_MEDIAS.indexOf(scope.file.type) == -1) {
        scope.file.status = files.statuses.open_by_link;
        return;
      }

      //load file status and localstorage data
      scope.file = files.get(scope.file);
      /*
       * register for download progress events
       */
      var fileName = files.fileName(scope.file);
      scope.progress = 0;
      $rootScope.$on(fileName + '.progress', function(e, progress) {
        if (progress.lengthComputable) {
          $timeout(function() {
            scope.progress =  Math.floor(progress.loaded / progress.total * 100);
          }, 0);
        }
      });

      $rootScope.$on(fileName + '.finish', function(e,file) {
        $timeout(function() {
          angular.extend(scope.file, file);
          window.plugins.toast.showShortBottom(translateFilter('Download finished'));
        }, 0);
      });

      $rootScope.$on(fileName + '.error', function(e,error) {
        $timeout(function() {
          //reset file status
          scope.file.status = files.statuses.download;
          window.plugins.toast.showShortBottom(translateFilter('Download failed'));
        }, 0);
      });

      /**
       *  The manage file available methods
       */
      scope.downloadFile = function (file) {
        files.download(file);
      }

      scope.openFile = function (file) {
        files.open(file);
      };

      scope.deleteFile = function (file) {
        var shouldDelete = $window.confirm(translateFilter('You want to remove the file?'));
        if (!shouldDelete) { return; }
        files.remove(file).then(function(data) {
          $timeout(function() {
            console.log('removed file');
            scope.file = data;
          },0);
        }, function() {
          //error was already logged by the service
          window.plugins.toast.showShortBottom(translateFilter('Error removing the file.'));
        });
      };
    }
	};
});

