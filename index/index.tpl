<!DOCTYPE html>
<html lang="en" {if !$build}ng-app="meumobiApp"{/if} ng-controller="SiteCtrl">
<head>
  <meta charset="utf-8">
  <title>{$performance.site.title}</title>
  <meta name="description" content="RI Santander">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">	
  <!--link rel="stylesheet" href="themes/rimobi/css/rimobi.min.css" -->
  <link rel="stylesheet" href="themes/rimobi/css/bootstrap.css">
  <link rel="stylesheet" href="themes/rimobi/css/font-awesome.min.css">
  <link rel="stylesheet" href="themes/rimobi/css/font.css">
  <link rel="stylesheet" href="themes/rimobi/css/style.css">
  <link rel="stylesheet" href="themes/rimobi/css/plugin.css">
  <link rel="stylesheet" href="themes/rimobi/css/custom.css">
  <link rel="stylesheet" href="themes/rimobi/css/blueimp-gallery.min.css" defer>

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
    <a class="navbar-brand" ng-click="goTo('/')">
    <img ng-if="performance.site.logo" ng-src="{{thumbify(performance.site.logo, '200x200_')}}" data-ng-alt="{{performance.site.title}}" width="123">
    <span class="text-white" ng-if="!performance.site.logo" ng-bind="performance.site.title"></span>
    </a>
    <button type="button" class="btn btn-link pull-left nav-toggle visible-xs" data-toggle="class:slide-nav slide-nav-left" data-target="body">
      <i class="fa fa-bars fa-lg text-white"></i>
    </button>
    <ul class="nav navbar-nav hidden-xs">
    </ul>
	</header>
  <!-- / header -->
  <!-- nav -->
  <nav id="nav" class="nav-primary hidden-xs {{performance.site.theme.layout_alternatives.nav}}">
    <ul class="nav" data-spy="affix" data-offset-top="50" nav-menu="active">
      <li id="home">
        <a ng-click="goTo('/')">
          <i class="fa fa-home fa-lg"></i><span translate>Home</span>
        </a>
      </li>
      <li ng-repeat="category in performance.categories"
        id="nav-category-{{category.id}}"
        class="dropdown-submenu">
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
     <li id="news" ng-if="performance.news">
        <a ng-click="goTo('/news')">
          <i class="fa fa-rss fa-lg"></i><span ng-bind="performance.newsCategory.title"></span>
        </a>
      </li>
     <li id="contact">
        <a ng-click="goTo('/contact')">
          <i class="fa fa-envelope-o fa-lg"></i><span ng-bind="performance.site.theme.tokens.contact|translate"></span>
        </a>
      </li>
    </ul>
  </nav>
  <!-- / nav -->
  <section id="content">
    <section class="main padder">
    <div ng-view></div><!-- view -->
    {/literal}
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
  var config_data = {};
  {/literal}
  config_data.DOMAIN = "{$domain}";
  config_data.SITEBUILDER = "{$smarty.const.SITE_BUILDER_URL}"; //REMOVE IF SANTANDER
  config_data.HOME = "{$performance.site.theme.layout_alternatives.home}";
  config_data.LOCALE = "{$performance.site.language}";
  config_data.IS_APP = {if $build}true{else}false{/if};
  config_data.ANALYTICS = '{if is_array($performance.site.analytics_token)}{$performance.site.analytics_token[1]}{else}{$performance.site.analytics_token}{/if}';
  var translations = {if $performance.site.language != 'auto'}{translations lang=$performance.site.language}{else}{translations}{/if};
  {literal}
  </script>

  {/literal}
  {if $build}
  <script type="text/javascript" src="cordova.js"></script>
  <script type="text/javascript" src="PushNotification.js"></script>
  <script type="text/javascript" src="js/jquery.min.js" defer></script>
  {else}
  <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js" defer></script>
  {/if}
  <script src="themes/rimobi/js/grid/jquery.grid-a-licious.min.js" defer></script>
  <!--script type="text/javascript" src="themes/rimobi/js/rimobi.min.js" defer></script-->

<!--
  ADD IF SANTANDER PROJECT
  <script type="text/javascript" src="themes/rimobi/js/lib/aes.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/md5.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/santander_config.js" defer></script>
-->
  <script type="text/javascript" src="themes/rimobi/js/lib/angular-file-upload-shim.min.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angular/angular.min.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angular/angular-route.min.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angular/angular-sanitize.min.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angular/angular-cookies.min.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angular/angular-touch.min.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angular/angular-resource.min.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angular-file-upload.min.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angularLocalStorage.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angular-translate.min.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angular-slugify.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angular-pushwoosh.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angular-calendar.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/truncate.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angulartics.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angulartics-ga.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angular-media-player.min.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/app/helpers.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/app/services.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/app/controllers.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/app/filters.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/app/directives.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/app/settings.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/app/bootstrap.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/bootstrap.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/parsley/parsley.min.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/jquery.blueimp-gallery.min.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/app.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/app.plugin.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/app.data.js" defer></script>
  <script type="text/javascript" src="themes/rimobi/js/custom.js" defer></script>

  <script type="text/javascript" src="themes/rimobi/js/lib/angular/i18n/angular-locale_{$current_locale}.js" defer></script>
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
  <script type="text/javascript" src="js/index.js" defer></script>
  <script type="text/javascript" defer>
    app.initialize();
  </script>
{/if}
</body>
</html>
