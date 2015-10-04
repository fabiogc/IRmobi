(function() {
	'use strict';

	angular
	.module('meumobi.services.Utils', ['meumobi.services.Cordova'])
	.factory('UtilsService', ['deviceReady', 'striptagsFilter', 'br2nlFilter', 'translateFilter', UtilsService]);

	function UtilsService(deviceReady, striptags, br2nl, translate) {
		var service = {};
		
		service.createBase64Image = createBase64Image;
		service.safeApply = safeApply;
		service.isOnline = isOnline;
		service.hideSplashScreen = hideSplashScreen;
		service.statusBar = statusBar;
		service.shareFeed = shareFeed;
		service.shareMedia = shareMedia;
		service.openMedia = openMedia;
		service.initPushwoosh = initPushwoosh;
		service.addEvent2Calendar = addEvent2Calendar;
		service.confirm = confirm;
		service.toast = toast;
 
		return service;
		
		function addEvent2Calendar(item) {
			deviceReady(function() {
				if (window.plugins && window.plugins.calendar) {
					var description = striptags(br2nl(item.description));
					var startDate = new Date(item.start_date * 1000); // must be Date obj
					var endDate = new Date(item.end_date * 1000);
					var title = striptags(item.title);
					var address = striptags(item.address);
					var success = function(message) {
						toast(translate("Event Successfully Created!"));
						AppRate.promptForRating();
					};
					var error = function(message) { toast("Error: " + JSON.stringify(message)); };

					confirm(translate("Add Event to Device Calendar?"), 
						function(confirmed) {
							if (confirmed) {
								console.log("Create Event Confirmed");
								if (true) { //(device.platform == "Android") {
									window.plugins.calendar.createEventInteractively(title,address,description,startDate,endDate,success,error);
								} else {
									window.plugins.calendar.createEvent(title,address,description,startDate,endDate,success,error);
								}
							}
							else {
								console.log("Create Event Canceled");
							}
						}
					);
				 } else {
					console.log("Missing window.plugins.calendar");
				}
			});
		}
		
		function initPushwoosh() {
			if (window.plugins && window.plugins.pushNotification) {
				if (device.platform == "Android") {
					registerPushwooshAndroid();
				}
				if (device.platform == "iPhone" || device.platform == "iOS") {
					registerPushwooshIOS();
				}
			}
		}
		
		function saveImage(path, domain) {
			console.log("Canvas: " + domain + path);
			//console.log(UtilsService);
			createBase64Image(domain+path, function(img64) {
				localStorage[path] = img64;
			});
		}

		function saveAllImages(imagesUrls, callback) {
			var imagesToSave = imagesUrls.length,
			totalImages = imagesToSave - 1;
			while (imagesToSave--) {
				//can't save all the images. the 5MB limit has been exceeded
				//app.saveImage(imagesUrls[imagesToSave],function(imageId, img64){
					//totalImages--;
					//if(imagesToSave == totalImages){
						callback();
						//}
						//});
					}
				}
		
				function deleteImages() {
					for (prop in localStorage) {
						if (prop.indexOf('image_') != -1) {
							delete localStorage[prop];
						}
					}
				}
		
		function createBase64Image(url, callback) {
			var img = new Image;
			img.setAttribute('crossOrigin', 'anonymous');
			img.onload = function() {
				imgToBase64(img, callback);
			}
			img.src = url;
		}
			
		function imgToBase64(img, callback) {
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			console.log(img.width, img.height)
			canvas.getContext("2d").drawImage(img, 0, 0);
			var base64 = canvas.toDataURL('image/png');
			if (callback) {
				callback(base64);
			} else {
				return base64;
			}
		}
		
		function hideSplashScreen() {
			if (navigator.splashscreen) {
				navigator.splashscreen.hide();
			}
		}
		
		function statusBar() {
			if (typeof StatusBar !== 'undefined') {
				StatusBar.overlaysWebView(false);
				StatusBar.styleLightContent();
				StatusBar.backgroundColorByName("black");	
			}
		}
		
		function safeApply(scope, fn) {
			var phase = scope.$root.$$phase;
			if (phase == '$apply' || phase == '$digest') {
				if (fn && (typeof(fn) === 'function')) {
					fn();
				}
			} else {
				scope.$apply(fn);
			}
		}
		
		function isConnectionOnline(type) {
			var states = {};
			states[Connection.UNKNOWN] = false;
			states[Connection.ETHERNET] = true;
			states[Connection.WIFI] = true;
			states[Connection.CELL_2G] = true;
			states[Connection.CELL_3G] = true;
			states[Connection.CELL_4G] = true;
			states[Connection.CELL] = true;
			states[Connection.NONE] = false;
			var connection = states[type] ? true : false;	
			
			return connection;
		}

		function isOnline(done) {
			deviceReady(function() {
				var connection = false;
				if (navigator.connection) {
					console.log("navigator.connection: [BEGIN]" );
					var networkState = navigator.connection.type;
					connection = isConnectionOnline(networkState);
					console.log("navigator.connection: " + connection);
					done(connection);
				} else {
					connection = navigator.onLine;
					done(connection);
				}
			});
		}
		
		function shareFeed(item) {
			var that = this;
			console.log("Share Item: " + item.title);
			deviceReady(function() {
				if (window.plugins && window.plugins.socialsharing) {
					var subject = item.title;
					var message = item.description;
					message = message.replace(/(<([^>]+)>)/ig, "");

					var link = item.link;
					var img = (item.images.length > 0) ? that.getImage(item.images[0].path) : null;

					//Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
					window.plugins.socialsharing.share(message, subject, img, link);
					AppRate.promptForRating();
				}
			});
		}
		
		function shareMedia(file) {
			var that = this;
			console.log("Share Media: " + file.title);
			deviceReady(function() {
				if (window.plugins && window.plugins.socialsharing) {
					var subject = file.title;
					var message = "IRmobi: Media Sharing";
					message = message.replace(/(<([^>]+)>)/ig, "");

					var link = file.path;
					// var img = (item.images.length > 0) ? that.getImage(item.images[0].path) : null;
					console.log("socialSharing: " + link);
					window.resolveLocalFileSystemURL(link, 
						function(fileEntry) {
							console.log("onResolveLocalFileSystemURL Success");
							console.log(fileEntry);
							window.plugins.socialsharing.share(null, null, fileEntry.nativeURL)
						}, function() {
							console.log("Error on resolveLocalFileSystemURL");
						});
					//Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
					// window.plugins.socialsharing.share(message, subject, img, link);
					// window.plugins.socialsharing.share(message, subject, link)
				}
			});
		}
		
		function openMedia(file) {
			var that = this;
			console.log("Open Media: " + file.title);
			deviceReady(function() {
				cordova.plugins.fileOpener2.open(
				    file.path,
				    'application/pdf', 
				    { 
				        error : function(e) { 
				            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
				        },
				        success : function () {
				            console.log('file opened successfully');                
				        }
				    }
				);				
			});
		}


		function confirm(message, callback, title) {
			title = (title != undefined) ? title : 'Confirm';
			var callbacker = function (buttonIndex){
				var val = (buttonIndex == 1);
				callback(val);
			}
			if (navigator.notification) {
				
				navigator.notification.confirm(
					message,
					callbacker, //callback method...
					title
					//buttonLabels: Array of strings specifying button labels. (Array) (Optional, defaults to [OK,Cancel])
				);
			} else {
				var r = confirm(title);
				callback(r);
			}
		}
	
		function toast(message, success, fail) {
			deviceReady(function() {
				if (window.plugins && window.plugins.toast) {
					window.plugins.toast.showLongBottom(message,
						function(resp) {
							if (success) {
								success(resp);
							}
						},
						function(err) {
							if (fail) {
								fail(err);
							}
						}
					);
				} else {
					alert(message);
				}
			});
		}
	}
})();
