IRmobi
=========

IRmobi is an Investors Relationship App that allows companies to push important information and content (multimedia and documents) to their analysts and investors.

- News Feeds, including rich media
- Events Sharing: add events on device calendar
- Download Documents to read offline
- Contact Us: Fill Form to contact IR department
- Multi-Language
- Push Notification: important communications (news or event) can be delivered by mobile Push Notification

Give organization the ability to manage content and customize interface through the cloud CMS [meumobi].

> Streamline IR Communication and Increase Analysts & Investors Engagement

Tech
-----------

IRmobi uses a number of open source projects to work properly:

* [PhoneGap] - open source framework to create mobile apps using standardized web APIs
* [meumobi] - mobile site builder

Installation
--------------

```sh
# Installing Required Tools
# [gulp should be installed locally and globally](http://blog.dwaynecrooks.com/post/110903139442/why-do-we-need-to-install-gulp-globally-and)
$ sudo npm install -g bower gulp phonegap

# Clone Repository
$ git clone "https://github.com/meumobi/IRmobi.git" && cd IRmobi

# Install Dependencies
$ bower install
$ sudo npm install

# Build your Project
$ gulp release --project=<NAME_OF_PROJECT> --env=<NAME_OF_ENVIRONMENT>

# Test/Debug in a Web Browser
$ gulp --project=<NAME_OF_PROJECT> --env=<NAME_OF_ENVIRONMENT>


# Troubleshooting
Due to following issue need to force install of imgcache.js#v1.0rc1
https://github.com/chrisben/imgcache.js/issues/116
$ bower install imgcache.js#v1.0rc1

Testing meumobi API
----
Example of GET list of latest items

```sh
$ curl http://meumobi.com/api/<YOUR_MEUMOBI_SITE_URL>/items/latest
```

Contributing
----

1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request


[org.apache.cordova.device]:https://github.com/apache/cordova-plugin-device
[org.apache.cordova.file]:https://github.com/apache/cordova-plugin-file
[org.apache.cordova.file-transfer]:https://github.com/apache/cordova-plugin-file-transfer
[io.github.pwlin.cordova.plugins.fileopener2]:https://github.com/pwlin/cordova-plugin-file-opener2
[nl.x-services.plugins.toast]:https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin
[meumobi]:http://enterprise.meumobilesite.com/
[@meumobi]:http://twitter.com/meumobi
[MobileAngularUI]:http://mobileangularui.com
[PhoneGap]:http://phonegap.com
[com.jcjee.plugins.emailcomposer]:https://github.com/jcjee/email-composer.git 
