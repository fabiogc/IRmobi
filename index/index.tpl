<!DOCTYPE html>
<html lang="en" {if !$build}ng-app="meumobiApp"{/if} ng-controller="SiteCtrl">
{literal}
<head>
  <meta charset="utf-8">
  <title ng-bind-template="{{performance.site.title}}"></title>
  <meta name="description" content="RI Santander">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">	
  <link rel="stylesheet" href="themes/rimobi/css/rimobi-min.css">
  <link rel="stylesheet" href="themes/rimobi/css/blueimp-gallery.min.css">
  <link rel="stylesheet" href="themes/rimobi/css/bootstrap-image-gallery.min.css">
  <!--link rel="stylesheet" href="/themes/rimobi/css/bootstrap.css">
  <link rel="stylesheet" href="/themes/rimobi/css/font-awesome.min.css">
  <link rel="stylesheet" href="/themes/rimobi/css/font.css" cache="false">
  <link rel="stylesheet" href="/themes/rimobi/css/style.css">
  <link rel="stylesheet" href="/themes/rimobi/css/plugin.css">
  <link rel="stylesheet" href="/themes/rimobi/css/landing.css">
  <link rel="stylesheet" href="/themes/rimobi/css/custom.css"-->
  {/literal}
  {$site.css_token|cssOnline}
  {if !$build}
  <link rel="shortcut icon" href="/ri/{$performance.site.title|parseSlug}.ico">
  {$performance.site.apple_touch_icon|appleTouchIcons}
  <!--[if lt IE 9]>
    <script src="themes/rimobi/js/ie/respond.min.js" cache="false"></script>
    <script src="themes/rimobi/js/ie/html5.js" cache="false"></script>
    <script src="themes/rimobi/js/ie/excanvas.js" cache="false"></script>
  <![endif]-->
  {/if}
  {literal}
</head>
<body class="navbar-fixed">
  <!-- header -->
    <header id="header" class="navbar" ng-style="{'background-color': performance.site.theme.colors.defaultBg}">
    <a class="navbar-brand" href="#/">
    <img ng-src="{{thumbify(performance.site.logo, '200x200_')}}" alt="{{performance.site.title}}" width="123">
    </a>
    <button type="button" class="btn btn-link pull-left nav-toggle visible-xs" data-toggle="class:slide-nav slide-nav-left" data-target="body">
      <i class="icon-reorder icon-xlarge text-white"></i>
    </button>
    <ul class="nav navbar-nav hidden-xs">
    </ul>
	</header>
  <!-- / header -->
  <!-- nav -->
  <nav id="nav" class="nav-primary hidden-xs">
    <ul class="nav" data-spy="affix" data-offset-top="50" nav-menu="active">
      <li id="home">
        <a href="#/">
          <i class="icon-home icon-xlarge"></i><span translate>Home</span>
        </a>
      </li>
      <li ng-repeat="category in performance.categories"
        id="nav-category-{{category.id}}"
        class="dropdown-submenu">
        <a ng-if="!category.children.length" ng-href="#/{{category.type}}/{{category.id}}">
          <i class="icon-chevron-sign-right icon-xlarge"></i><span ng-bind="category.title"></span>
        </a>
        <a ng-if="category.children.length">
          <i class="icon-chevron-sign-right icon-xlarge"></i><span ng-bind="category.title"></span>
        </a>
        <ul class="dropdown-menu" ng-if="category.children.length">
          <li ng-repeat="subCategory in category.children">
            <a ng-href="#/{{subCategory.type}}/{{subCategory.id}}" ng-bind="subCategory.title"></a>
          </li>
        </ul>
      </li>
      <li id="contact">
        <a href="#/contact">
          <i class="icon-envelope-alt icon-xlarge"></i><span translate>Contact IR</span>
        </a>
      </li>
    </ul>
  </nav>
  <!-- / nav -->
  <section id="content">
    <section class="main padder">
    <div ng-view></div><!-- view -->
    <section class="panel text-center l-s-small">
      <div class="panel-body">
        <img src="themes/rimobi/images/icon-sanb.png" alt="SANB11" width="29">
        <img src="themes/rimobi/images/icon-ibovespa.png" alt="Ibovespa" width="36">
        <img src="themes/rimobi/images/icon-bsbr.png" alt="BSBR" width="17">
        <img src="themes/rimobi/images/icon-ibr.jpg" alt="IBrX" width="30">
        <img src="themes/rimobi/images/icon-igc.png" alt="IGC" width="18">
        <img src="themes/rimobi/images/icon-igct.png" alt="IGCT" width="52">
      </div>
    </section>

    </section>
  </section>
  <!-- footer -->
  <footer id="footer">
  </footer>
  <a class="hide slide-nav-block" data-toggle="class:slide-nav slide-nav-left" data-target="body"></a>
  <!-- The Bootstrap Image Gallery lightbox, should be a child element of the document body -->
  <div id="blueimp-gallery" class="blueimp-gallery">
    <!-- The container for the modal slides -->
    <div class="slides"></div>
    <!-- Controls for the borderless lightbox -->
    <h3 class="title"></h3>
    <a class="prev">‹</a>
    <a class="next">›</a>
    <a class="close">×</a>
    <a class="play-pause"></a>
    <ol class="indicator"></ol>
    <!-- The modal dialog, which will be used to wrap the lightbox content -->
    <div class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" aria-hidden="true">&times;</button>
                    <h4 class="modal-title"></h4>
                </div>
                <div class="modal-body next"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default pull-left prev">
                        <i class="glyphicon glyphicon-chevron-left"></i>
                        Previous
                    </button>
                    <button type="button" class="btn btn-primary next">
                        Next
                        <i class="glyphicon glyphicon-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
  </div>
  <!-- / footer -->
  <script type="text/javascript">
  var config_data = {};
  {/literal}
  config_data.DOMAIN = "{$domain}";
  config_data.ENV = "{$smarty.const.BKF_ENV}";
  config_data.SERVICES_URL = "{$smarty.const.SERVICES_URL}";
  config_data.API_URL = "{$smarty.const.SITE_BUILDER_URL}";
  config_data.LOCALE = "{$performance.site.language}";
  config_data.IS_APP = {if $build}true{else}false{/if};
  config_data.ANALYTICS = '{if is_array($performance.site.analytics_token)}{$performance.site.analytics_token[1]}{else}{$performance.site.analytics_token}{/if}';
  var translations = {if $performance.site.language != 'auto'}{translations lang=$performance.site.language}{else}{translations}{/if};
  {literal}
  </script>

  <script type="text/javascript" src="themes/rimobi/js/lib/fastclick.js"></script>
  <script type="text/javascript">
    window.addEventListener('load', function() {
    FastClick.attach(document.body);
  }, false);
  </script>
  {/literal}
  {if $build}
  <script type="text/javascript" src="cordova.js"></script>
  <script type="text/javascript" src="js/jquery.min.js"></script>
  {else}
  <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
  {/if}
  <script type="text/javascript" src="themes/rimobi/js/lib/angular.all.js"></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angular/i18n/angular-locale_{$current_locale}.js"></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angularLocalStorage.js"></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angular-translate.min.js"></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angular-slugify.js"></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/truncate.js"></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angulartics.js"></script>
  <script type="text/javascript" src="themes/rimobi/js/lib/angulartics-ga.js"></script>
  <script type="text/javascript" src="themes/rimobi/js/app/services.js"></script><!-- define rest service -->
  <script type="text/javascript" src="themes/rimobi/js/app/controllers.js"></script><!-- the app controllers -->
  <script type="text/javascript" src="themes/rimobi/js/app/directives.js"></script><!-- define directives -->
  <script type="text/javascript" src="themes/rimobi/js/app/settings.js"></script><!-- define directives -->
  <script type="text/javascript" src="themes/rimobi/js/app/bootstrap.js"></script><!-- initial setup of the app and routers -->
  <!-- Bootstrap -->
  <script src="themes/rimobi/js/bootstrap.js"></script>
  <script src="themes/rimobi/js/parsley/parsley.min.js"></script>
  <script src="themes/rimobi/js/grid/jquery.grid-a-licious.min.js"></script>
  <script src="themes/rimobi/js/jquery.blueimp-gallery.min.js"></script>
  <script src="themes/rimobi/js/bootstrap-image-gallery.min.js"></script>
<!-- app -->
  <script src="themes/rimobi/js/app.js"></script>
  <script src="themes/rimobi/js/app.plugin.js"></script>
  <script src="themes/rimobi/js/app.data.js"></script>

  <script  type="text/javascript">
  {if $performance.site.analytics_token && !$build}
  {literal}
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    {/literal}ga('create', '{if is_array($performance.site.analytics_token)}{$performance.site.analytics_token[0]}{else}{$performance.site.analytics_token}{/if}',{literal}
    { 'cookieDomain': 'none' });
  {/literal}
  {/if}
	</script>
  
{if $build}
  <script type="text/javascript" src="themes/rimobi/js/phonegap/utils/Calendar.js"></script>
  <script type="text/javascript" src="js/index.js"></script>
  <script type="text/javascript">
    app.initialize();
  </script>
{/if}
</body>
</html>
