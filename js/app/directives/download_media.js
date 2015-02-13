meumobiDirectives.directive('downloadMedia', function(Categories, $window, translateFilter, Files, $timeout, IS_APP) {
	return {
		restrict: 'E',
		scope: {
			media: '='
		},
		template: '<a ng-disabled="disabled" ng-click="downloadFile(media)"> <span class="btn btn-white btn-xs"><i class="fa fa-2x {{icon}}"></i> {{status}}</span> {{media.title}}</a>',
    link: function(scope) {
      var icons = {
        "application/pdf": "fa-file-pdf-o",
        "application/vnd.ms-excel": "fa-file-excel-o",
        "audio/mpeg": "fa-file-audio-o",
        "application/vnd.ms-powerpoint": "fa-file-powerpoint-o"
      };
      scope.icon = icons[scope.media.type] ? icons[scope.media.type] : "fa-file-o";
      if (IS_APP && localStorage[fileName]) {
        scope.status = translateFilter('Downloaded');
        scope.disabled = true;
      } else {
        scope.status = translateFilter('Download');
      }

      scope.downloadFile = function (media) {
        if (!IS_APP) {
          $window.open(media.url,'_blank');
          return false;
        }

        if (scope.disabled)
          return false;

        scope.disabled = true;
        var downloading = translateFilter('Downloading'); 
        scope.status = downloading + '...';

        Files.download(media).then(function() {
          $timeout(function() {
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

