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
meumobiFilters.filter('mediaIconClass', function(MEDIAS_ICONS_AND_LABELS) {
  return function(type) {
    return MEDIAS_ICONS_AND_LABELS[type] ? MEDIAS_ICONS_AND_LABELS[type].class : 'fa-external-link';
  };
});
meumobiFilters.filter('mediaClickLabel', function(MEDIAS_ICONS_AND_LABELS) {
  return function(type) {
    return MEDIAS_ICONS_AND_LABELS[type] ? MEDIAS_ICONS_AND_LABELS[type].label : 'open';
  };
});
