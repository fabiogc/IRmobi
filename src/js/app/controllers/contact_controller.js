(function() {
	'use strict';

	angular
	.module('meumobiApp')
	.controller('ContactController', ContactController)

	function ContactController($http, $translate, Settings, SiteService) {

		var vm = this;
		vm.formData = {};
		vm.submit = submitForm;
		vm.isSantander = false;
		vm.business = null;
		vm.site = null;

		activate();

		function activate() {
			return getPerformance().then(function() {
				
			});
		}

		function getPerformance() {
			return SiteService.getPerformance()
			.then(function(data) {
				vm.business = getBusiness(data);
				vm.site = getSite(data);
				return data;
			});
		}

		function getBusiness(data) {
			return data.business;
		}

		function getSite(data) {
			return data.site;
		} 

		function submitForm(isValid) {
			$scope.submitted = true;
			if (isValid) {
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
		}
	}
})();