(function(angular) {
  'use strict';
  angular.module('angular-adtech', [])
  .directive('adthechAd', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        network: '=',
        siteId: '=',
        placementId: '=',
        alias: '='
      },
      template: '<div id="{{placementId}}"></div>',
      link: function(scope, elem, attrs, ctrl) {
        if (typeof ADTECH === 'undefined') { //stop because the ADTECH isn't available
          console.log('ADTECH not exist');
          return;
        }
        var api = {};
        api.configPage = function(siteId, network) {
          ADTECH.config.page = {
            protocol: 'https',
            server: 'secserv.adtech.de',
            network: network,
            siteid: siteId,
            params: {
              loc: '100'
            }
          };
        };
        api.configPlacement = function(placementId, alias) {
          ADTECH.config.placements[placementId] = {
            sizeid: 3055,
            params: {
              alias: alias,
              target: '_blank'
            }
          };
        }
        api.loadAd = function(placementId) {
          ADTECH.loadAd(placementId);  
        }
        //only setup after have the settings values
        scope.$watch('placementId', function(data) {
          if (data) {
            api.configPage(scope.siteId, scope.network.toString());
            api.configPlacement(scope.placementId, scope.alias);
            //on page change
            scope.$on("$routeChangeSuccess", function (event, current, previous) {
              if (current.$$route.originalPath)//prevent load if invalid page or a redirect
                api.loadAd(scope.placementId);
            });
          } 
        });

      }
    };
  });
}(angular));
