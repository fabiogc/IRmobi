<!DOCTYPE html>
{assign var="defer" value="defer"}
{if $build}
  {assign var="defer" value=""} 
{/if}
<html lang="en" {if !$build}ng-app="meumobiApp"{/if} ng-controller="SiteCtrl">
<head>
  <meta charset="utf-8">
  <title>{$performance.site.title}</title>
	{if $performance.site.description}
	<meta name="description" content="{$performance.site.description|strip_tags:false}" />
	{/if}
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">	
  <link rel="stylesheet" href="themes/rimobi/css/app.min.css">

  {if $performance.site.ios_app_id}
  <meta name="apple-itunes-app" content="app-id={$performance.site.ios_app_id}">
  {/if}

  {if $performance.site.android_app_id}
  <meta name="google-play-app" content="app-id={$performance.site.android_app_id}">
  {/if}

  {$site.css_token|cssOnline}
  {if !$build}
  <link rel="shortcut icon" href="/ri/{$performance.site.title|parseSlug}.ico">
  {$performance.site.apple_touch_icon|appleTouchIcons}
  {if $performance.site.splash_screen}
  <link rel="apple-touch-startup-image" href="{$performance.site.splash_screen|thumbify}">
  {/if}
  <!--[if lt IE 9]>
    <script src="themes/rimobi/js/ie/respond.min.js" cache="false"></script>
    <script src="themes/rimobi/js/ie/html5.js" cache="false"></script>
    <script src="themes/rimobi/js/ie/excanvas.js" cache="false"></script>
  <![endif]-->
  {/if}
</head>
{literal}
<body ng-class="performance.site.theme.layout_alternatives.navbar">
  <!-- header -->
  <header id="header" class="navbar" ng-style="{'background-color': performance.site.theme.colors.defaultBg}">
    <ul class="nav navbar-nav navbar-language pull-right">
      <li>
        <a ng-if="canReload()" ng-click="reload()">
          <i class="fa fa-lg fa-refresh"></i>
        </a>
      </li>
      <li ng-class="{'hide' : languages.length < 2}" class="dropdown">
        <a href="" class="dropdown-toggle" data-toggle="dropdown">
          <i class="fa fa-globe fa-lg"></i> <span class="hidden-xs-only" ng-bind="'Select Language'|translate"></span>
          <b class="caret hidden-xs-only"></b>
        </a>
        <ul class="dropdown-menu pull-right">
          <li ng-repeat="language in languages" class="capitalize"><a href="" ng-click="setLanguage(language)">{{language}}</a></li>
        </ul>
      </li>
    </ul>
    <a class="navbar-brand" ng-click="goTo('/')">
    <img ng-if="performance.site.logo" ng-src="{{thumbify(performance.site.logo)}}" data-ng-alt="{{performance.site.title}}" width="123">
    <span ng-if="!performance.site.logo" ng-bind="performance.site.title"></span>
    </a>
    <button type="button" class="btn btn-link pull-left nav-toggle visible-xs" data-toggle="class:slide-nav slide-nav-left" data-target="body">
      <i class="fa fa-bars fa-lg"></i>
    </button>
    <ul class="nav navbar-nav hidden-xs">
    </ul>
  </header>
  <!-- / header -->
  <!-- nav -->
  <nav id="nav" class="nav-primary hidden-xs {{performance.site.theme.layout_alternatives.nav}}">
    <ul class="nav" data-spy="affix" data-offset-top="50" nav-menu="active">
      <li>
      </li>
      <li id="home" ng-class="{ active: isActive('/')}">
        <a ng-click="goTo('/')">
          <i class="fa fa-home fa-lg"></i><span translate>Home</span>
        </a>
      </li>
      <li ng-repeat="category in performance.categories"
        id="nav-category-{{category.id}}"
        class="dropdown-submenu" ng-class="{ active: isActive('/category/'+category.id)}">
        <a ng-if="!category.children.length" ng-click="goTo('/'+category.type+'/'+category.id)">
          <i class="fa fa-chevron-circle-right fa-lg"></i><span ng-bind="category.title"></span>
        </a>
        <a ng-if="category.children.length">
          <i class="fa fa-chevron-circle-right fa-lg"></i><span ng-bind="category.title"></span>
        </a>
        <ul class="dropdown-menu" ng-if="category.children.length">
          <li ng-repeat="subCategory in category.children">
            <a ng-click="goTo('/'+subCategory.type+'/'+subCategory.id)" ng-bind="subCategory.title"></a>
          </li>
        </ul>
      </li>
      {/literal}
      {if $build}
      <li id="files" {literal}ng-class="{ active: isActive('/files')}"{/literal}>
        <a ng-click="goTo('/files')">
          <i class="fa fa-files-o fa-lg"></i><span ng-bind="{literal}'Files'|translate{/literal}"></span>
        </a>
      </li>
      {/if}
      {literal}
     <li id="news" ng-if="performance.news" ng-class="{ active: isActive('/news')}">
        <a ng-click="goTo('/news')">
          <i class="fa fa-rss fa-lg"></i><span ng-bind="performance.newsCategory.title"></span>
        </a>
      </li>
     <li id="contact" ng-class="{ active: isActive('/contact')}">
        <a ng-click="goTo('/contact')">
          <i class="fa fa-envelope-o fa-lg"></i><span ng-bind="performance.site.theme.tokens.contact|translate"></span>
        </a>
      </li>
    </ul>
  </nav>
  <!-- / nav -->
  <section id="content">
    <loading-message></loading-message>
    <section class="main padder">
      {/literal}
      {foreach from=$performance.plugins item=plugin}
      {if $plugin.plugin == 'adtech'}
      <adtech-ad network="{$plugin.options.network}" site-id="{$plugin.options.site_id}" placement-id="{$plugin.options.placement_id}" alias="{$plugin.options.alias}"></adtech-ad>
      {/if}
      {/foreach}
      <div ng-view autoscroll="true"></div><!-- view -->
      {include file="index/_`$performance.site.theme.layout_alternatives.footer`_footer.tpl"}
      {literal}
    </section>
  </section>
  <!-- footer -->
  <footer id="footer">
  </footer>
  <a class="hide slide-nav-block" data-toggle="class:slide-nav slide-nav-left" data-target="body"></a>
  <!-- The Bootstrap Image Gallery lightbox, should be a child element of the document body -->
  <div id="blueimp-gallery" class="blueimp-gallery blueimp-gallery-controls" data-use-bootstrap-modal="false">
    <!-- The container for the modal slides -->
    <div class="slides"></div>
    <!-- Controls for the borderless lightbox -->
    <h3 class="title"></h3>
    <a class="prev">‹</a>
    <a class="next">›</a>
    <a class="close">×</a>
    <a class="play-pause"></a>
    <ol class="indicator"></ol>
  </div>
  <!-- / footer -->
  <script type="text/javascript">
  var config_data = {DOMAINS: {}};
  {/literal}
  config_data.DOMAINS.{$current_locale} = "{$domain}";
  config_data.SITEBUILDER = "{$smarty.const.SITE_BUILDER_URL}"; //REMOVE IF SANTANDER
  config_data.HOME = "{$performance.site.theme.layout_alternatives.home}";
  config_data.IS_APP = {if $build}true{else}false{/if};
  {if $build}
  config_data.PUSH = {literal}{appId: "482BE-4B9BA", gcmProjectNumber: "706933317564"};{/literal}
  {/if}
  config_data.ANALYTICS = '{if is_array($performance.site.analytics_token)}{$performance.site.analytics_token[1]}{else}{$performance.site.analytics_token}{/if}';
  var translations = {translations};
  {literal}
  </script>

  {/literal}
  {if $build}
  <script type="text/javascript" src="cordova.js"></script>
  {/if}
  <script type="text/javascript" src="themes/rimobi/js/app.min.js" {$defer}></script>

  <!-- script type="text/javascript" src="/node_modules/angular-i18n/i18n/angular-locale_{$current_locale}.js" {$defer}></script-->
  {if !$build}
  <script type="text/javascript">
      {literal}
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      {/literal}
      ga('create', '{$smarty.const.GA_ACCOUNT}','auto',
      {literal}
      {'name': 'meumobi'});
      {/literal}
      {if $performance.site.analytics_token}
        ga('create', '{if is_array($performance.site.analytics_token)}{$performance.site.analytics_token[0]}{else}{$performance.site.analytics_token}{/if}',
        {literal}
        { 'cookieDomain': 'none' });
        {/literal}
      {/if}
	</script>
  {/if}
{if $build}
  <script type="text/javascript" src="themes/rimobi/js/app/cordova-bootstrap.js"></script>
  <script type="text/javascript">
    app.initialize();
  </script>
{/if}
</body>
</html>
