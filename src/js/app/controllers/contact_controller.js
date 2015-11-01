(function() {
	'use strict';

	angular
	.module('meumobiApp')
	.controller('ContactController', ContactController)

	function ContactController($http, $translate, SiteService, meumobiSite) {

		var vm = this;
		vm.formData = {};
		vm.submit = submitForm;
		vm.isSantander = false;
		vm.business = null;
		vm.site = null;

		activate();

		function activate() {
			meumobiSite.getWebAppData()
			.then(function(response) {
				vm.business = response.data.business;
				vm.site = response.data.site;
			})
			.catch(function(response) {
				console.log(response);
			})
		}

		function submitForm(isValid) {
			vm.submitted = true;
			if (isValid) {
				$http({
					method: 'POST',
					url: meumobiSite.getSiteBuilderApiUrl('/mail'),
					data: $.param(vm.formData),
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
		}
	}
})();