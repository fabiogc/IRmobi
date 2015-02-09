meumobiDirectives.directive('downloadMedia', function(Categories, $window,translateFilter, $timeout, IS_APP) {
	return {
		restrict: 'E',
		scope: {
			media: '='
		},
		template: '<a ng-disabled="disabled" ng-click="downloadFile(media)"> <span class="btn btn-white btn-xs"><i class="fa {{icon}}"></i> {{status}}</span> {{media.title}}</a>',
    link: function(scope) {
      var extension = scope.media.type.split('/')[1];
      var fileName = md5(scope.media.title) + '.' + extension;
      var icons = {
        "application/pdf": "fa-file-pdf-o",
        "application/vnd.ms-excel": "fa-file-excel-o",
        "audio/mpeg": "fa-file-audio-o",
        "application/vnd.ms-powerpoint": "fa-file-powerpoint-o"
      };
      scope.filesize = 0;
      //if (scope.media.length)
        //scope.filesize = (scope.media.length / (1024 * 1024)).toFixed(2);//byte to mb
      scope.icon = icons[media.type] ? icons[media.type] : "fa-file-o";
      if (IS_APP && localStorage[fileName]) {
        scope.status = translateFilter('Downloaded');
        scope.disabled = true;
      } else {
        scope.status = translateFilter('Download');
      }
      /**
      * Download file to local folder.
      */
      scope.downloadFile = function (media) {
        if (!IS_APP) {
          $window.open(media.url,'_blank');
          return false;
        }
        if (scope.disabled)
          return false;
        if (device.platform.toLowerCase() == "android") {
            localDir = cordova.file.externalRootDirectory + "/Downloads/rimobi";
        } else {
            localDir = cordova.file.dataDirectory;
        }
        scope.disabled = true;
        scope.status = translateFilter('Downloading') + '...';
        var localPath = localDir + '/' + fileName;
        var fileTransfer = new FileTransfer();
        var uri = encodeURI(media.url);
        localStorage[fileName] = media.title;
        localStorage[fileName+"type"] = media.type;

        fileTransfer.download(uri, localPath, function(entry) {
          console.log(entry);
          window.plugins.toast.showShortBottom(translateFilter('Download finished'));
          $timeout(function() {
            scope.status = translateFilter('Download finished');
          }, 0);
        }, function(error) {
          console.log(error);
          localStorage.removeItem(fileName);
          localStorage.removeItem(fileName+"type");
          window.plugins.toast.showShortBottom(translateFilter('Download failed'));
          $timeout(function() {
            scope.status = translateFilter('Download');
            scope.disabled = false;
          }, 0);
        }, false);
      }

    }
	};
});

