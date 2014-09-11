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

meumobiControllers.controller('EventListCtrl', ['$scope',
    'Categories',
    '$routeParams',
    'Calendar',
    'striptagsFilter',
    'br2nlFilter',
    'translateFilter',
    function($scope, Categories, $routeParams, Calendar, striptags, br2nl, translate) {
      $scope.addEvent = function(item) {
        console.log('add event');
        Calendar.addEvent(
          $scope.performance.site.title + ': ' + striptags(item.title),
          striptags(item.address),
          striptags(br2nl(item.description)),
          item.start_date,
          item.end_date,
          translate('Add event to calendar?')
        ).then(function(data) {
          console.log(data);
          if (data)
            alert('The event was successfully added!')
        }, function(reason) {
          console.log(reason);
          if (reason !== false)
            alert('Could not add the event!');
        }); 
      };

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

meumobiControllers.controller('NewsCtrl', ['$scope', 'Site', 
    function($scope, Site) {
      Site.news().then(function(data) {
        $scope.items = data;
      });
    }
]);

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
          media.videoId = getVideoId(media.src);
          media.source = isYoutubeUrl(media.src) ? 'youtube' : 'vimeo';
          return media;
        });
      });
    }]);

meumobiControllers.controller('ItemAddCtrl', ['$scope', 'Items', 'Categories', '$routeParams', '$location','$upload',
    function($scope, Items, Categories, $routeParams, $location, $upload) {
      $scope.images = {};
      $scope.item = {};
      $scope.uploaded = null;
      $scope.percent = 0;
      $scope.submitting = false;
      $scope.category = Categories.get({id: $routeParams.category_id});
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
