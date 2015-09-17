$(document).ready(function() {
	!function ($) {
		$('#nav').on('click', 'a', function() {
			var link = $(this);
			var next = link.next('ul.dropdown-menu');
			if (next.length) {
				var hidden = next.is(':hidden');
				console.log(hidden);
				$('#nav ul.dropdown-menu:visible').hide(100, 'swing');
				if (hidden)
					next.show(200, 'swing');
			} else {
				$('body').removeClass('slide-nav slide-nav-left');
			}
		});
	}(window.jQuery);
});

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