(function() {
	'use strict';

	angular
	.module('meumobiApp')
	.controller('LatestController', LatestController);

	function LatestController($scope, Items, CONFIG, $timeout, $location) {

    $scope.has_breadcrumb = (CONFIG.STYLE.homeTemplate != 'latest');
    $scope.goToItem = function(item) {
      Items.setCurrent(item);
      $location.path('/items/' + item._id);
    };
    var fulfill = function(response) {
      $scope.items = response.data.items;
      $timeout(function() {
        $("#gallery").removeClass('hide');
        var buildGallery = function(){
          $("#gallery").gridalicious({
            animate: true,
            gutter: 15,
            width: 250
          });
        }
        buildGallery();
      },100);
      if (response.promise) response.promise.then(fulfill);
    };
    var loadData = function() {
      Items.latest().then(fulfill);
    }
    $scope.$on('reloadData', loadData);//handle reload
    loadData();//first load
	}
})();