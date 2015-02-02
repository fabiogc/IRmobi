var meumobiControllers = angular.module('meumobiControllers', ['angularFileUpload']);

meumobiControllers.controller('SiteCtrl', ['$scope', 'Site', 'Categories', '$location', '$window', 'Settings',
  function($scope, Site, Categories, $location, $window, Settings) {
    $scope.headlinesRows = 2;
    $scope.languages = Settings.getAvailableLanguages();
    //change language and reload the site
    $scope.setLanguage = function(language) {
      Settings.setLanguage(language);
      $window.location.reload();
    };
    var params = {};
    var search = parseLocationSearch($window.location.search);
    if (search.skin)
    params.skin = search.skin;
    var fulfill = function(response) {
      var data = response.data;
      data.categories = Categories.getTree(data.categories);
      var categories = data.categories.slice(0);
      $scope.performance = data;
      if (data.site.stock_symbols) {
        $scope.firstCategory = categories.shift();
        $scope.headlinesRows = 1;
      }
      $scope.splitedCategories = $scope.splitArray(categories, 2);
      if (response.promise) response.promise.then(fulfill);
    };
    Site.get().then(fulfill);
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
      console.log(item);
      Calendar.addEvent(
        $scope.performance.site.title + ': ' + striptags(item.title),
        striptags(item.address),
        striptags(br2nl(item.description)),
        item.start_date,
        item.end_date,
        translate('Add event to calendar?')
      ).then(function(added) {
        if (added)//only alert if event has added
          alert(translate('The event was successfully added!'))
      }, function(reason) {
        console.log(reason);
        if (reason !== false)
          alert(translate('Could not add the event!'));
      }); 
    };

    Categories.load($routeParams.id).then(function(data) {
      $scope.category = data;
    });

    $scope.currentPage = $routeParams.page ? $routeParams.page : 1;//set current pagination page

    Categories.items($routeParams.id, {page: $scope.currentPage, order: 'start_date,DESC'}).then(function(response){
      $scope.items = response.data.items;
    });
  }]);

meumobiControllers.controller('LatestItemsCtrl', ['$scope', 'Items', 'HOME','$timeout', '$location',
  function($scope, Items, HOME, $timeout, $location) {
    $scope.has_breadcrumb = (HOME != 'latest');
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
    Items.latest().then(fulfill);
    $scope.goToItem = function(item) {
      Items.setCurrent(item);
      $location.path('/items/' + item._id);
    };
  }]);

meumobiControllers.controller('NewsCtrl', ['$scope', 'Site', 
  function($scope, Site) {
    Site.news().then(function(data) {
      $scope.items = data;
    });
  }
]);

meumobiControllers.controller('CategoryShowCtrl', ['$scope', 'Categories', 'Items', '$routeParams', '$location',
  function($scope, Categories, Items, $routeParams, $location) {
    Categories.load($routeParams.id).then(function(data) {
      $scope.category = data;
    });

    $scope.currentPage = $routeParams.page ? $routeParams.page : 1;//set current pagination page
    var fulfillItems = function(response) {
      $scope.items = response.data.items;
      if (response.promise) response.promise.then(fulfillItems);
    };

    Categories.items($routeParams.id, {page: $scope.currentPage}).then(fulfillItems);

    $scope.goToItem = function(item) {
      Items.setCurrent(item);
      $location.path('/items/'+ item._id);
    };
  }]);

meumobiControllers.controller('ItemAddCtrl', ['$scope', 'Items', 'Categories', '$routeParams', '$location','$upload',
  function($scope, Items, Categories, $routeParams, $location, $upload) {
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

meumobiControllers.controller('ContactCtrl', ['$scope', '$http', '$translate', 'DOMAIN',
  function($scope, $http, $translate, DOMAIN) {
    $scope.formData = {};
    $scope.isSantander = $scope.performance.site.title.toLowerCase().indexOf("santander") !== -1;
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
