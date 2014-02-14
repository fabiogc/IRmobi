var meumobiControllers = angular.module('meumobiControllers', ['angularLocalStorage']);

meumobiControllers.controller('SiteCtrl', ['$scope', 'storage', 'Site',
    function($scope, storage, Site, Category) {
      storage.bind($scope,'performance');
      Site.get({}, function(data) {
        $scope.performance = data;
      });

      //set correct items
      $scope.$watch('performance', function(newValue) {
      });
    }]);

meumobiControllers.controller('CategoryShowCtrl', ['$scope', 'Categories', '$routeParams',
    function($scope, Categories, $routeParams) {
      $scope.category = Categories.get({id: $routeParams.id});

      $scope.currentPage = $routeParams.page ? $routeParams.page : 1;//set current pagination page

      $scope.items = Categories.items({id: $routeParams.id, page: $scope.currentPage}, function(data){
        $scope.items = data.items;
      });
    }]);

meumobiControllers.controller('ItemShowCtrl', ['$scope', 'Items', 'Categories', '$routeParams',
    function($scope, Items, Categories, $routeParams) {
      $scope.item = Items.get({id: $routeParams.id}, function(data) {
        $scope.category = Categories.get({id: data.parent_id});
      });
    }]);

meumobiControllers.controller('ContactCtrl', ['$scope', '$http',
    function($scope, $http) {
      $scope.formData = {};
      $scope.submit = function() {
        if ($('#contact-form').parsley('validate')) {//this is a validation a from "first" theme
          $http({
            method: 'POST',
            url:'/index/contact',
            data: $.param($scope.formData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
          })
          .success(function(data) {
            console.log(data);
            if (data.success) {
              $scope.success = data.message;
            } else {
              $scope.error = data.message; 
            }
          });
        }
      };
    }]);
