var meumobiControllers = angular.module('meumobiControllers', ['angularLocalStorage']);

meumobiControllers.controller('SiteCtrl', ['$scope', 'storage', 'Site',
    function($scope, storage, Site, Category) {
      storage.bind($scope,'performance');
      $scope.headlinesRows = 2;

      Site.get({}, function(data) {
        $scope.performance = data;
        var categories = data.categories.slice(0);
        if (data.site.title == "Santander") {
            $scope.firstCategory = categories.shift();
            $scope.headlinesRows = 1;
        }
 
        $scope.splitedCategories = $scope.splitArray(categories, 2);
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

meumobiControllers.controller('ContactCtrl', ['$scope', '$http', 'DOMAIN',
    function($scope, $http, DOMAIN) {
      $scope.formData = {};
      var url = 'http://' + DOMAIN + '/index/contact';
      $scope.submit = function() {
        if ($('#contact-form').parsley('validate')) {//this is a validation a from "first" theme
          $http({
            method: 'POST',
            url: url,
            data: $.param($scope.formData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
          })
          .success(function(data) {
            if (data.success) {
              alert('Sua mensagem foi enviada com sucesso!');//data.message;
            } else {
              alert('Desculpe, mas sua mensagem não foi enviada!');//data.message; 
            }
          });
        }
      };
    }]);
