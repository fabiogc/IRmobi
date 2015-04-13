(function() {
  'use strict';
  angular
  .module('meumobi')
  .factory('device', device);

  function device() {
    var service = {
      isAndroid: isAndroid,
      isIos: isIos,
      platform: platform,
      isOnline: isOnline
    };

    return service;

    ////////////////////////
    
    function isAndroid() {
      return this.platform() == 'Android';
    }

    function isIos() {
      return this.platform() == 'iOS';
    }

    function platform() {
      return window.device ? window.device.platform : null;
    }

    function isOnline() {
      //TODO
    }
  }
})();
