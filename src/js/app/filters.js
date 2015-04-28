var meumobiFilters = angular.module('meumobiFilters', []);
meumobiFilters.filter('br2nl', function() {
  return function(text) {
    return text.replace(/<br\s*[\/]?>/gi, "\n");
  };
});
meumobiFilters.filter('striptags', function() {
  return function(text) {
    return angular.element('<div/>').html(text).text();
  };
});
meumobiFilters.filter('mediaIconClass', function(MEDIAS) {
  return function(type) {
    return MEDIAS[type] ? MEDIAS[type].class : 'fa-external-link';
  };
});
meumobiFilters.filter('mediaClickLabel', function(MEDIAS) {
  return function(type) {
    return MEDIAS[type] ? MEDIAS[type].label : 'Open';
  };
});
meumobiFilters.filter('bytesToSize', function() {
  return function(bytes) {
    bytes = bytes * 1000;
    if(bytes == 0) return '0 Byte';
    var k = 1000;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
  };
});
