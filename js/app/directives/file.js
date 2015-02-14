meumobiDirectives.directive('file', function($rootScope, translateFilter, files, $timeout, $window, IS_APP) {
	return {
		restrict: 'E',
		scope: {
      file: '='
		},
		templateUrl: 'themes/rimobi/partials/utils/file.html',
    link: function(scope) {
      var downloading = translateFilter('Downloading'); 
      var icons = {
        "application/pdf": "fa-file-pdf-o",
        "application/vnd.ms-excel": "fa-file-excel-o",
        "audio/mpeg": "fa-file-audio-o",
        "application/vnd.ms-powerpoint": "fa-file-powerpoint-o"
      };
      scope.icon = icons[scope.file.type] ? icons[scope.file.type] : "fa-file-o";
      scope.isApp = IS_APP;
      //if not a app stop here
      if (!IS_APP) {
        return;
      }
      scope.isDownloaded = files.isDownloaded(scope.file);
      if (scope.isDownloaded && !scope.file.path) {
        console.log('loading file');
        scope.file = files.get(scope.file);
      } else if (files.isDownloading(scope.file)) {
        scope.status = translateFilter('Downloading');
        scope.disabled = true;
      } else {
        scope.status = translateFilter('Download');
      }
      console.log(scope.isDownloaded);
      console.log(scope.file);

      var fileName = files.fileName(scope.file);
      $rootScope.$on(fileName + '.progress', function(e, progress) {
        if (progress.lengthComputable) {
          $timeout(function() {
            scope.status = downloading + ' ' + Math.floor(progress.loaded / progress.total * 100) + "%";
          }, 0);
        }
      });
      $rootScope.$on(fileName + '.finish', function(e,file) {
        $timeout(function() {
          scope.isDownloaded = true;
          angular.extend(scope.file, file);
          console.log(scope.isDownloaded);
          console.log(JSON.stringify(scope.file));
          window.plugins.toast.showShortBottom(translateFilter('Download finished'));
        }, 0);
      });
      $rootScope.$on(fileName + '.error', function(e,error) {
        $timeout(function() {
          scope.status = translateFilter('Download');
          scope.disabled = false;
          window.plugins.toast.showShortBottom(translateFilter('Download failed'));
        }, 0);
      });

      scope.downloadFile = function (file) {
        if (scope.disabled) return false;
        scope.disabled = true;
        scope.status = downloading + '...';
        files.download(file);
      }

      scope.openFile = function (file) {
        files.open(file);
      };

      scope.deleteFile = function (file) {
        var shouldDelete = $window.confirm(translateFilter("You want to remove the file?"));
        if (!shouldDelete) { return; }
        files.remove(file).then(function() {
          $timeout(function() {
            scope.isDownloaded = false;
            scope.status = translateFilter('Download');
            scope.disabled = false;
            delete file.path;
          },0);
        }, function() {
          window.plugins.toast.showShortBottom(translateFilter("Error removing the file."));
        });
      };

    }
	};
});

