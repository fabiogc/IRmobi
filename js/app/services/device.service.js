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
      return this.platform() == 'android';
    }

    function isIos() {
      return this.platform() == 'ios';
    }

    function platform() {
      return device ? device.platform.toLowerCase() : null; 
    }

    function isOnline {
      //TODO
    }
  }
})();
