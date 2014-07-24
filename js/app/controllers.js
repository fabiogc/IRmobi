var meumobiControllers = angular.module('meumobiControllers', ['angularLocalStorage', 'angularFileUpload']);

meumobiControllers.controller('SiteCtrl', ['$scope', 'storage', 'Site','Categories', '$location', '$window',
    function($scope, storage, Site, Categories, $location, $window) {
      storage.bind($scope,'performance');
      $scope.headlinesRows = 2;
      var params = {};
      var search = parseLocationSearch($window.location.search);
      if (search.skin)
  params.skin = search.skin;
Site.get(params, function(data) {
  data.categories = Categories.getTree(data.categories);
  var categories = data.categories.slice(0);
  $scope.performance = data;
  if (data.site.stock_symbols) {
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

meumobiControllers.controller('EventListCtrl', ['$scope', 'Categories', '$routeParams',
    function($scope, Categories, $routeParams) {
      $scope.category = Categories.get({id: $routeParams.id});

      $scope.currentPage = $routeParams.page ? $routeParams.page : 1;//set current pagination page

      $scope.items = Categories.items({id: $routeParams.id, page: $scope.currentPage, order: 'start_date,DESC'}, function(data){
        $scope.items = data.items;
      });
    }]);

meumobiControllers.controller('LatestItemsCtrl', ['$scope', 'Items', 'HOME','$timeout', 
    function($scope, Items, HOME,$timeout) {
      $scope.has_breadcrumb = (HOME != 'latest');
      Items.latest(function(data){
        $scope.items = data.items;
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
      });
    }]);

meumobiControllers.controller('ItemShowCtrl', ['$scope', '$sce', 'Items', 'Categories', '$routeParams', 'IS_APP',
    function($scope, $sce, Items, Categories, $routeParams, IS_APP) {
      $scope.mediaFilter = function(media) {
        var allowed = ['application/pdf','text/html', 'audio/mpeg'];
        var allow = (allowed.indexOf(media.type) != -1);
        if (media.type == 'text/html' && isYoutubeUrl(media.url) || isVimeoUrl(media.url))
        allow = false;
        return allow;
        };
        $scope.videoPlaylist = [];
        $scope.item = Items.get({id: $routeParams.id}, function(data) {
        $scope.category = Categories.get({id: data.parent_id});
        $scope.audioPlaylist = Items.getMedias(data, 'audio');
        $scope.videoPlaylist = Items.getMedias(data, 'video');
        var socialVideoPlaylist = Items.getMedias(data, function(media) {
          return isYoutubeUrl(media.url) || isVimeoUrl(media.url)
        });
        $scope.socialVideoPlaylist = socialVideoPlaylist.map(function(media) {
          media.embedUrl = $sce.trustAsResourceUrl(parseVideoUrl(media.src));
          return media;
        });
      });
    }]);

meumobiControllers.controller('ItemAddCtrl', ['$scope', 'Items', 'Categories', '$routeParams', '$location','$upload',
    function($scope, Items, Categories, $routeParams, $location, $upload) {
      $scope.files = [];
      $scope.item = {};
      $scope.category = Categories.get({id: $routeParams.category_id});
      $scope.addFile = function(files) {
        $scope.files = files[0];
      };
      $scope.addItem = function() {
        $scope.item.parent_id = $routeParams.category_id;
        console.log($scope.item);
        Items.save($.param($scope.item), function(data) {
          console.log('item saved');
          console.log(data);
          Items.upload(data._id, $scope.files, {visible:1}).success(function(data, status, headers, config) {
            console.log(data);
            alert('Yes, success:)');
            $location.path('/'+$scope.category.type+'/'+$routeParams.category_id); 
          });
        });
      };
    }]);

meumobiControllers.controller('ContactCtrl', ['$scope', '$http', '$translate', 'DOMAIN',
    function($scope, $http, $translate, DOMAIN) {
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
              $translate('Your message has been sent successfully!').then(function (string) {
                alert(string);
              });
            } else {
              $translate('Sorry, but your message was not sent!').then(function (string) {
                alert(string);
              });
            }
          });
        }
      };
    }]);
