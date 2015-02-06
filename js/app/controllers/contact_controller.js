meumobiControllers.controller('ContactCtrl', function($scope, $http, $translate, Settings) {
    $scope.formData = {};
    $scope.isSantander = $scope.performance.site.title.toLowerCase().indexOf("santander") !== -1;
    $scope.submit = function() {
      if ($('#contact-form').parsley('validate')) {//this is a validation from "first" theme
        $http({
          method: 'POST',
          url: Settings.getSiteBuilderApiUrl('/mail'),
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
  });
