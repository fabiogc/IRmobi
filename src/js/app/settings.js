var meumobiSettings = angular.module('meumobiSettings',[]);

angular.forEach(config_data,function(value, key) {
  meumobiSettings.constant(key, value);
});

meumobiSettings.constant('STOCKS_API', 'http://stocks.' + config_data.SITEBUILDER.replace(/.*?:\/\//g, ''));
meumobiSettings.constant('TIMEOUT', 10000);
meumobiSettings.constant('ITEM_PER_PAGE', 20);
meumobiSettings.constant('MEDIAS', {
  'application/pdf': {
    class: 'fa-file-pdf-o',
    label: 'View',
    extension: 'pdf',
    download: true
  },
  'application/vnd.ms-excel': {
    class: 'fa-file-excel-o',
    label: 'View',
    extension: 'xls',
    download: true
  },
  'audio/mpeg': {
    class: 'fa-file-audio-o', 
    label: 'Play',
    extension: 'mp3',
    download: true
  },
  'application/vnd.ms-powerpoint': {
    class: 'fa-file-powerpoint-o',
    label: 'View',
    extension: 'ppt',
    download: true,
  }
});

var gaPlugin = null;
