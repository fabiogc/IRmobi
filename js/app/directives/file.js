meumobiDirectives.directive('file', function(Categories, translateFilter, files, $timeout, IS_APP) {
	return {
		restrict: 'E',
		scope: {
      file: '='
		},
		templateUrl: 'themes/rimobi/partials/utils/file.html',
    link: function(scope) {
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
      if (scope.isDownloaded) {
        scope.file = files.get(scope.file);
      } else if (files.isDownloading(scope.file)) {
        scope.status = translateFilter('Downloading');
        scope.disabled = true;
      } else {
        scope.status = translateFilter('Download');
      }


      scope.downloadFile = function (file) {
        if (scope.disabled) return false;
        scope.disabled = true;
        var downloading = translateFilter('Downloading'); 
        scope.status = downloading + '...';
        files.download(file).then(function(entry) {
          $timeout(function() {
            scope.file.entry = entry;
            scope.status = translateFilter('Download finished');
          }, 0);
        }, function(error) {
          $timeout(function() {
            scope.status = translateFilter('Download');
            scope.disabled = false;
          }, 0);
        },function(e) {//progress event
          if (e.lengthComputable) {
            $timeout(function() {
              scope.status = downloading + ' ' + Math.floor(e.loaded / e.total * 100) + "%";
            }, 0);
          }
        });
      }

    }
	};
});

