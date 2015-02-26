var meumobiSettings = angular.module('meumobiSettings',[]);

angular.forEach(config_data,function(value, key) {
  meumobiSettings.constant(key, value);
});

meumobiSettings.constant('STOCKS_API', 'http://stocks.' + config_data.SITEBUILDER.replace(/.*?:\/\//g, ''));
meumobiSettings.constant('TIMEOUT', 10000);
meumobiSettings.constant('ITEM_PER_PAGE', 20);
meumobiSettings.constant('MEDIAS_ICONS_AND_LABELS', {
  'application/pdf': {class: 'fa-file-pdf-o', label: 'read'},
  'application/vnd.ms-excel': {class: 'fa-file-excel-o', label: 'read'},
  'audio/mpeg': {class: 'fa-file-audio-o', label: 'play'},
  'application/vnd.ms-powerpoint': {class: 'fa-file-powerpoint-o', label: 'read'},
  'text/html': {class: 'fa-external-link', label: 'open'}
});
meumobiSettings.constant('ALLOWED_DOWNLOAD_MEDIAS', [
  'application/pdf',
  'application/vnd.ms-excel',
  'audio/mpeg',
  'application/vnd.ms-powerpoint'
]);

meumobiSettings.factory('interceptor', function($q) {
  return {
    'requestError': function(rejection) {
      // do something on error
      console.log(rejection);
      return $q.reject(rejection);
    },
  'responseError': function(rejection) {
    // do something on error
    return $q.reject(rejection);
  }
  };
});
var gaPlugin = null;
