## Release Notes for meumobi ##

Update these notes using: git log --pretty=format:'* %s' --no-merges rel-2.6.3..HEAD

### rel-1.2.7 (20151120) ###
* Add text/html media support and update layout for it
* Remove GetImage, replace by meumobiSite.getAssetUrl. Move Image url computing form view to controller to prevent useless processing
* Rename ShareFeed Utils function to ShareItem
* PROJECTS: Add Biosev App and Embraerintegration env
* UPDATE: Close #95, Close #89, Show thumbnail of item's media and Display all available informations on Sharing
* UPDATE: Close #19, Hide the reload button if the device is offline, and alert when connection status changes.
* UPDATE: Close #86, Add Native Spinner Dialog when App launches and user resync data
* Rename services files and remove unused angular-pushwoosh
* Add online webputty css call during debug
* BUG: Close #81, background fixed is not resized as expected
* BUG: Close #85, use selected language (vs default) each time the App is Open
* All JS packages using a debug property should use config.debug to guarantee consistency
* Update Santander config and css
* UPDATE: Close #46, Add Release Notes
* Update Santander Assets (launcher-icon, cover, launch-image, header-color)
 
### rel-1.2.6 (20151001) ###
