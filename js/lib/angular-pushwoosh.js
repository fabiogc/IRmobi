(function(angular) {
  'use strict';
  angular.module('pushwooshNotification', [])
  .provider('$pushNotification', function() {
    this.settings = {
      appId: null,
      appName: null,
      gcmProjectNumber: null,
      onPushNotification: null,
      onRegisterSuccess: null,
      onRegisterError: null
    };

    var api = {
      isAvailable: function() {
        return (typeof window.plugins !== 'undefined')
                && (typeof window.plugins.pushNotification !== 'undefined');
      },
      getTags: function() {}
    };

    api.pushNotification = api.isAvailable() ? window.plugins.pushNotification : null;

    var initPushwoosh = function() {
      if(device.platform == "Android") {
        registerPushwooshAndroid();
      }
      if(device.platform == "iPhone" || device.platform == "iOS") {
        registerPushwooshIOS();
      }
    };

    var registerPushwooshAndroid = function() {
      console.log('register push android');
      api.pushNotification.onDeviceReady();
      //set push notifications handler
      document.addEventListener('push-notification', this.settings.onPushNotification);
      //!!! Please note this is an API for PGB plugin. This code is different in CLI plugin!!!
      api.pushNotification.registerDevice({
        projectid: this.settings.gcmProjectNumber,
        appid : this.setting.appId
      }, function(token) {
        console.warn('push token: ' + pushToken);
        onPushwooshInitialized(token);
      }, function(status) {
        console.warn(JSON.stringify(['failed to register ', status]));
        if (this.settings.onRegisterError)
          this.settings.onRegisterError(status);
      });
    };

    this.register = function(settings) {
      angular.extend(this.settings, settings);
      console.log(this.settings);
      console.log('is available', api.isAvailable());
      if (api.isAvailable()) {
        initPushwoosh();
      }
    };

    this.$get = function() {
      return api; 
    }
  });
}(angular));
