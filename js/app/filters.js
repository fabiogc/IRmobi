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
