(function() {
	'use strict';

	angular
	.module('meumobi.services.Language', [])
	.factory('LanguageService', LanguageService);
		
	function LanguageService(APP, meumobiSite) {
		var service = {};
		
		service.getAvailableLanguages = getAvailableLanguages;
		service.setLanguage = setLanguage;
		service.getLanguage = getLanguage;
		service.loadLanguage = loadLanguage;
 
		return service;
		
		function getAvailableLanguages() {
			return Object.keys(APP.DOMAINS);
		}
		
		function setLanguage(lang) {
			// Check if language is available, if not log and cancel action
			var availableLanguages = getAvailableLanguages();
			if (availableLanguages.indexOf(lang) > -1) {
				localStorage['Settings.language'] = lang;
				meumobiSite.setLanguage(lang);
				//$rootScope = language;
			} else {
				console.log("Lang not available: " + lang);
			}
		}
		
		function getLanguage() {
			var lang = localStorage['Settings.language'];
			if (lang == null) {
				// If no language saved on localstorage then get the 1st Available
				console.log("No language defined on localstorage");
				var languages = getAvailableLanguages();
				return languages.shift();
			} else {
				console.log("Return local Storage language: " + localStorage['Settings.language']);
				return lang;
			}
		}
		
		function loadLanguage() {
			var lang = getLanguage();
			setLanguage(lang);
		}
	}
})();