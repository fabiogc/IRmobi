(function() {
  angular
  .module('meumobi')
  .directive('loadingMessage', loadingMessage);

  function loadingMessage($rootScope) {
    var directive = {
      link: link,
      templateUrl: 'themes/rimobi/partials/utils/loading_message.html',
      restrict: 'E'
    };
    return directive;

    function link(scope, element, attrs) {
      $rootScope.$on('loading:start', function() {
        scope.isLoading = true;
        console.log('STARTT');
      });
      $rootScope.$on('loading:end', function() {
        scope.isLoading = false;
        console.log('ENDDD');
      });
    }
  }
})();
