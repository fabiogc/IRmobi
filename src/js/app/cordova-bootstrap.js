/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// Global InAppBrowser reference
var iabRef = null;
function iabLoadStart(event) {
	var css = '@keyframes rotate-loading{0%{transform:rotate(0deg);-ms-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);-moz-transform:rotate(0deg)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-moz-keyframes rotate-loading{0%{transform:rotate(0deg);-ms-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);-moz-transform:rotate(0deg)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-webkit-keyframes rotate-loading{0%{transform:rotate(0deg);-ms-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);-moz-transform:rotate(0deg)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-o-keyframes rotate-loading{0%{transform:rotate(0deg);-ms-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);-moz-transform:rotate(0deg)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@keyframes rotate-loading{0%{transform:rotate(0deg);-ms-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);-moz-transform:rotate(0deg)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-moz-keyframes rotate-loading{0%{transform:rotate(0deg);-ms-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);-moz-transform:rotate(0deg)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-webkit-keyframes rotate-loading{0%{transform:rotate(0deg);-ms-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);-moz-transform:rotate(0deg)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-o-keyframes rotate-loading{0%{transform:rotate(0deg);-ms-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);-moz-transform:rotate(0deg)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@keyframes loading-text-opacity{0%,20%{opacity:0}50%{opacity:1}100%{opacity:0}}@-moz-keyframes loading-text-opacity{0%,20%{opacity:0}50%{opacity:1}100%{opacity:0}}@-webkit-keyframes loading-text-opacity{0%,20%{opacity:0}50%{opacity:1}100%{opacity:0}}@-o-keyframes loading-text-opacity{0%,20%{opacity:0}50%{opacity:1}100%{opacity:0}}.loading,.loading-container{height:100px;position:relative;width:100px;border-radius:100%}.loading-container{height:100px;position:absolute;width:100px;border-radius:100%;left:50%;top:50%;margin:-50px 0 0 -50px}.loading{border:2px solid transparent;border-color:transparent #333;-moz-animation:rotate-loading 1.5s linear 0s infinite normal;-moz-transform-origin:50% 50%;-o-animation:rotate-loading 1.5s linear 0s infinite normal;-o-transform-origin:50% 50%;-webkit-animation:rotate-loading 1.5s linear 0s infinite normal;-webkit-transform-origin:50% 50%;animation:rotate-loading 1.5s linear 0s infinite normal;transform-origin:50% 50%}.loading-container:hover .loading{border-color:transparent #E45635}.loading-container .loading,.loading-container:hover .loading{-webkit-transition:all .5s ease-in-out;-moz-transition:all .5s ease-in-out;-ms-transition:all .5s ease-in-out;-o-transition:all .5s ease-in-out;transition:all .5s ease-in-out}#loading-text{-moz-animation:loading-text-opacity 2s linear 0s infinite normal;-o-animation:loading-text-opacity 2s linear 0s infinite normal;-webkit-animation:loading-text-opacity 2s linear 0s infinite normal;animation:loading-text-opacity 2s linear 0s infinite normal;color:#333;font-family:"Helvetica Neue, Helvetica, "arial;font-size:10px;font-weight:700;margin-top:45px;opacity:0;position:absolute;text-align:center;text-transform:uppercase;top:0;width:100px}';
	iabRef.insertCSS({code: css});
	var script = 'var el = document.createElement("div"); el.setAttribute("id", "loading"); el.setAttribute("class", "loading-container"); el.innerHTML= \'<div class="loading"></div><div id="loading-text">loading</div>\'; document.body.appendChild(el);';
	iabRef.executeScript({code: script});
}

function iabLoadStop(event) {
	var script = "var el = document.getElementById('loading');el.parentNode.removeChild(element);"
		iabRef.executeScript({code: script});
}

function iabClose(event) {
	iabRef.removeEventListener('loadstart', iabLoadStart);
	iabRef.removeEventListener('loadstop', iabLoadStop);
	iabRef.removeEventListener('exit', iabClose);
}

var app = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicity call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		if (navigator.notification) {
			window.alert = function(message) {
				navigator.notification.alert(message);
			};
		}
		angular.element(document).ready(function() {
			angular.bootstrap(document, ['meumobiApp']);

      var openAppBrowser = function (url, target, location, gdoc) {
        target = target ? target : '_blank';
        location = location ? location : 'no';
        //open on Gdoc if not IOS to prevent errors
				if (gdoc && target == '_blank' && device.platform.toLowerCase() != 'ios') {
					url = "https://docs.google.com/viewer?embedded=true&url=" + url;
				}
				iabRef = window.open(url, target, 'location='+ location +',enableViewportScale=yes');
				iabRef.addEventListener('loadstart', iabLoadStart);
				iabRef.addEventListener('loadstop', iabLoadStop);
				iabRef.addEventListener('exit', iabClose);
      };

     $(document).on('click', '[data-in-app-browser] a[href^=http],[data-in-app-browser] a[href^=https]', function(e){
        e.preventDefault();
        e.stopPropagation();
        console.log('In app browser');
        var $this = $(this);
        var parent = $this.parents('[data-in-app-browser]:first');
        console.log('location ' + parent.data('location'));
        console.log('target ' + parent.data('inAppBrowser'));
        openAppBrowser(this.href, parent.data('inAppBrowser'), parent.data('location'), parent.data('gdoc'));
      });

			$(document).on('click', "a[rel='external']", function(e) {
				e.preventDefault();
        e.stopPropagation();
				// Open in default browser App (on desktop: open in new window/tab)
        openAppBrowser(this.href, '_system');
			});

      //remove splash
      navigator.splashscreen.hide();
		});
	},
};
