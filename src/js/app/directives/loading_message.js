(function() {
  angular
  .module('meumobi')
  .directive('loadingMessage', loadingMessage);

  function loadingMessage() {
    var directive = {
      link: link,
      templateUrl: '/template/is/located/here.html',
      restrict: 'E'
    };
    return directive;

    function link(scope, element, attrs) {
      //TODO
    }
  }
})();
