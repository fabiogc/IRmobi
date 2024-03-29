angular.module('meumobiControllers', ['meumobi.services.Settings']);

angular.module('meumobiControllers').controller('LatestItemsCtrl', ['$scope', 'Items', 'CONFIG','$timeout', '$location',
  function($scope, Items, CONFIG, $timeout, $location) {
    $scope.has_breadcrumb = (CONFIG.STYLE.homeTemplate != 'latest');
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
  }]);

angular.module('meumobiControllers').controller('NewsCtrl', ['$scope', 'Site', 
  function($scope, Site) {
    Site.news().then(function(data) {
      $scope.items = data;
    });
  }
]);

angular.module('meumobiControllers').controller('CategoryShowCtrl', ['$scope', 'Categories', 'Items', '$routeParams', '$location',
  function($scope, Categories, Items, $routeParams, $location) {
    $scope.currentPage = $routeParams.page ? $routeParams.page : 1;//set current pagination page
    var fulfillItems = function(response) {
      $scope.items = response.data.items;
      if (response.promise) response.promise.then(fulfillItems);
    };
    var loadData = function() {
      Categories.load($routeParams.id).then(function(data) {
        $scope.category = data;
      });
      Categories.items($routeParams.id, {page: $scope.currentPage, order: 'published,DESC'}).then(fulfillItems);
    };
    $scope.$on('reloadData', loadData);//handle reload
    loadData();//first load
  }]);

angular.module('meumobiControllers').controller('ItemAddCtrl', ['$scope', 'Items', 'Categories', '$routeParams', '$location',
  function($scope, Items, Categories, $routeParams, $location) {
    $scope.images = {};
    $scope.item = {};
    $scope.uploaded = null;
    $scope.percent = 0;
    $scope.submitting = false;
    $scope.category = Categories.load($routeParams.category_id);
    $scope.addFile = function(files) {
      $scope.uploaded = false;
      $scope.submitting = true;
      Items.upload(files[0], {visible:1})
      .progress(function(evt) {
        $scope.percent = parseInt(100.0 * evt.loaded / evt.total);
      })
      .success(function(data, status, headers, config) {
          $scope.percent = 0;
          $scope.uploaded = true;
          $scope.submitting = false;
          $scope.images[data.id+''] = {title:""};
      });
    };
    $scope.addItem = function() {
      if ($scope.submitting) {
        console.log('already sent');
        return;
      }
      $scope.submitting = true;
      $scope.item.parent_id = $routeParams.category_id;
      $scope.item.images = $scope.images;
      console.log($scope.item);
      Items.save($.param($scope.item), function(data) {
        $scope.submitting = false;
          alert('Yes, success:)');
          $location.path('/'+$scope.category.type+'/'+$routeParams.category_id); 
      });
    };
  }]);
