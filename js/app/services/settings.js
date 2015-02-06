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
      console.log(localStorage['Settings.language']);
      return localStorage['Settings.language'];
    },
    getSiteBuilderApiUrl : function(uri) {
      uri = uri ? uri : '';
      return SITEBUILDER + '/api/' + DOMAINS[this.getLanguage()] + uri;
    }
	};
});
