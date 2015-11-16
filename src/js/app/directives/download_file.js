angular.module('meumobiDirectives').directive('downloadFileControls', function($rootScope, translateFilter, files, $timeout, $window, IS_APP, MEDIAS, UtilsService) {
	return {
		restrict: 'E',
		scope: {
      file: '='
		},
		template: "<ng-include src=\"'utils/' + file.status + '_file_controls.html'\" />",
    link: function(scope) {
      //use a simple link if not on app or file not allowed for download
      if (!IS_APP 
        || !MEDIAS[scope.file.type]//prevent undefined error
        || !MEDIAS[scope.file.type].download) {
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
          UtilsService.toast(translateFilter('Download finished'));
        }, 0);
      });

      $rootScope.$on(fileName + '.error', function(e,error) {
        $timeout(function() {
          //reset file status
          scope.file.status = files.statuses.download;
          UtilsService.toast(translateFilter('Download failed'));
        }, 0);
      });

      /**
       *  The manage file available methods
       */
      scope.downloadFile = function (file) {
        files.download(file);
      }

      scope.openInAppBrowser = function (uri, target) {
				var target = (target != undefined) ? target : '_system';
				var options = "location=no,enableViewportScale=yes";
				UtilsService.openInAppBrowser(uri, target, options);
      };

			scope.shareMedia = function(media) {
				UtilsService.shareMedia(media);
			};

			scope.openMedia = function(media) {
				UtilsService.openMedia(media);
			};

      scope.deleteFile = function (file) {
        UtilsService.confirm(
          translateFilter('You want to remove the file?'),
          function(index) {
            if (index != 1) return;//stop if not accepted
            files.remove(file).then(function(data) {
              $timeout(function() {
                console.log('removed file');
                scope.file = data;
              },0);
            }, function() {
              //error was already logged by the service
              UtilsService.toast(translateFilter('Error removing the file.'));
            });
          }
				);
      };
    }
	};
});

