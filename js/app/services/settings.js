meumobiServices.factory('Settings', function(SITEBUILDER, DOMAINS) {
	return {
    getAvailableLanguages : function() {
      return Object.keys(DOMAINS);
    },
    setLanguage : function(language) {
      localStorage['Settings.language'] = language;
    },
	  getLanguage : function() {
      //invalid language setted, change for the first language available
      if (!DOMAINS[localStorage['Settings.language']]) {
        this.setLanguage(this.getAvailableLanguages()[0]);
      }
      return localStorage['Settings.language'];
    },
    getSiteBuilderApiUrl : function() {
      return SITEBUILDER + '/api/' + DOMAINS[this.getLanguage()];
    }
	};
});
