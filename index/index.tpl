<!DOCTYPE html>
{literal}
<html lang="en" ng-app="meumobiApp"  ng-controller="SiteCtrl">
<head>
  <meta charset="utf-8">
  <title ng-bind-template="{{performance.site.title}}"></title>
  <meta name="description" content="mobile first, app, web app, responsive, admin dashboard, flat, flat ui">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">	
	<link rel="stylesheet" href="/themes/rimobi/css/bootstrap.css">
  <link rel="stylesheet" href="/themes/rimobi/css/font-awesome.min.css">
  <link rel="stylesheet" href="/themes/rimobi/css/font.css" cache="false">
  <link rel="stylesheet" href="/themes/rimobi/css/style.css">
  <link rel="stylesheet" href="/themes/rimobi/css/plugin.css">
  <link rel="stylesheet" href="/themes/rimobi/css/landing.css">
  <link rel="stylesheet" href="/themes/rimobi/css/custom.css">
  <!--[if lt IE 9]>
    <script src="/themes/rimobi/js/ie/respond.min.js" cache="false"></script>
    <script src="/themes/rimobi/js/ie/html5.js" cache="false"></script>
    <script src="/themes/rimobi/js/ie/excanvas.js" cache="false"></script>
  <![endif]-->
</head>
<body>
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
    <!--form class="navbar-form pull-left shift" action="" data-toggle="shift:appendTo" data-target=".nav-primary">
      <i class="icon-search text-muted"></i>
      <input type="text" class="input-sm form-control" placeholder="Search">
    </form-->
	</header>
  <!-- / header -->
  <!-- nav -->
  <nav id="nav" class="nav-primary hidden-xs">
    <ul class="nav" data-spy="affix" data-offset-top="50">
      <li ng-repeat="category in performance.categories|filter: {parent_id: '!'}" ng-class="getClass('/categories/' + category.id)">
        <a ng-href="#/{{category.type}}/{{category.id}}" data-toggle="class:slide-nav slide-nav-left" data-target="body">
          <i class=" icon-xlarge icon-{{category.title|slugify}}"></i><span ng-bind="category.title"></span>
        </a>
      </li>
      <li ng-class="getClass('/contact')">
        <a href="#/contact" data-toggle="class:slide-nav slide-nav-left" data-target="body">
          <i class="icon-envelope-alt icon-xlarge"></i><span>Fale com RI</span>
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
        <img src="/themes/rimobi/images/icon-sanb.png" alt="SANB11" width="29">
        <img src="/themes/rimobi/images/icon-ibovespa.png" alt="Ibovespa" width="36">
        <img src="/themes/rimobi/images/icon-bsbr.png" alt="BSBR" width="17">
        <img src="/themes/rimobi/images/icon-ibr.jpg" alt="IBrX" width="30">
        <img src="/themes/rimobi/images/icon-igc.png" alt="IGC" width="18">
        <img src="/themes/rimobi/images/icon-igct.png" alt="IGCT" width="52">
      </div>
    </section>

    </section>
  </section>
  <!-- footer -->
  <footer id="footer">
  </footer>
  <a class="hide slide-nav-block" data-toggle="class:slide-nav slide-nav-left" data-target="body"></a>
  <!-- / footer -->
  <script type="text/javascript">
	var config_data = {};
	{/literal}
	config_data.DOMAIN = "{$domain}";
	config_data.API_URL = "{$smarty.const.SITE_BUILDER_URL}";
	{literal}
  </script>
  <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
  <script type="text/javascript" src="/themes/rimobi/js/lib/angular.all.js"></script>
  <script type="text/javascript" src="/themes/rimobi/js/lib/angular/i18n/angular-locale_pt-br.js"></script>
  <script type="text/javascript" src="/themes/rimobi/js/lib/angularLocalStorage.js"></script>
  <script type="text/javascript" src="/themes/rimobi/js/lib/angular-slugify.js"></script>
  <script type="text/javascript" src="/themes/rimobi/js/app/services.js"></script><!-- define rest service -->
  <script type="text/javascript" src="/themes/rimobi/js/app/controllers.js"></script><!-- the app controllers -->
  <script type="text/javascript" src="/themes/rimobi/js/app/directives.js"></script><!-- define directives -->
  <script type="text/javascript" src="/themes/rimobi/js/app/settings.js"></script><!-- define directives -->
  <script type="text/javascript" src="/themes/rimobi/js/app/bootstrap.js"></script><!-- initial setup of the app and routers -->
  <!-- Bootstrap -->
  <script src="/themes/rimobi/js/bootstrap.js"></script>
  <script src="/themes/rimobi/js/parsley/parsley.min.js"></script>
<!-- app -->
  <script src="/themes/rimobi/js/app.js"></script>
  <script src="/themes/rimobi/js/app.plugin.js"></script>
  <script src="/themes/rimobi/js/app.data.js"></script>

  <!-- Sparkline Chart -->
  <script src="/themes/rimobi/js/charts/sparkline/jquery.sparkline.min.js"></script>  
  <!-- Easy Pie Chart -->
  <script src="/themes/rimobi/js/charts/easypiechart/jquery.easy-pie-chart.js"></script>
</body>
</html>
{/literal}
