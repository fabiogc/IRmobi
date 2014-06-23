config_data.SITEBUILDER = CryptoJS.AES.decrypt('U2FsdGVkX1+NCYaZJylfPETkCIrNg7X6OpzaSTuAFjHO8UvY3FOqZ3bF56ZCjjsF', '9456bbf53af6fdf30a5d625ebf155b4018c8b0aephp').toString(CryptoJS.enc.Utf8));
if (CryptoJS.MD5(config_data.SITEBUILDER) != '776e69d29f594c3619b67dce220ce48e') {
	config_data.SITEBUILDER = '';
}
