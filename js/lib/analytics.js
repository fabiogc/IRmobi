angular.module('meumobi.analytics')
.provider('analytics', function() {
  var analyticsId = null;
  var gaPlugin = null;
  this.setup = function(id) {
    analyticsId = id;
  };

  this.$get = function($q) {
    //setup Gaplugin after device ready event
    if (window.plugins 
      && window.plugins.gaPlugin 
      && analyticsId) {
      gaPlugin = window.plugins.gaPlugin;
      console.log('analytics id: '+ analyticsId);
      gaPlugin.init(function(success) {
        console.log('GAplugin setup sucess: '+success);
      }, function(error) {
        console.log('GAplugin setup error: '+error);
      }, analyticsId, 10);
    }
    //service methods
    return {
      trackPage: function(url) {
        var deferred = $q.defer();
        if (!gaPlugin)
          return deferred.reject('GAplugin not available');
        gaPlugin.trackPage(function(success) {
          console.log('successfuly track page+ ' + url);
          deferred.resolve(success);
        }, function(error) {
          deferred.reject(error);
        }, url);
        return deferred.promise;
      }
    };
  }
});
