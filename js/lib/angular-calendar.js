(function(angular) {
  'use strict';
  angular.module('phonegapCalendar', [])
  .factory('Calendar', function($q) {

    return {
      addEvent: function(title, address, description, start_date, end_date, confirm_message) {
        console.log({
          title: title,
          address: address,
          description: description,
          start_date: start_date,
          end_date: end_date
          });
        if (typeof window.plugins === 'undefined' || typeof window.plugins.calendar === 'undefined')
          return $q.reject(false);
        var deferred = $q.defer();
        var createEvent = function() {
          var startDate = new Date(start_date * 1000); // must de Date obj
          var endDate = new Date(end_date * 1000);
          var success = function(message) { 
            console.log("Success: " + JSON.stringify(message)); 
            deferred.resolve(message);
          };
          var error = function(message) {
            console.log("Error: " + message);
            deferred.reject(message);
          };

          window.plugins.calendar.createEvent(
            title,
            address,
            description,
            startDate,
            endDate,
            success,
            error);
        };

        //show confirm alert
        //TODO remove notification dependency from module
        navigator.notification.confirm ( confirm_message, function(buttonIndex) {
         if (buttonIndex == 1) {
          createEvent();
         } else {
          deferred.resolve(false);
         } 
        });
        return deferred.promise;
      }
    };
   });
}(angular));
