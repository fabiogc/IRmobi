<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title ng-bind-template="{$performance.site.title}"></title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">	
  <link rel="stylesheet" href="/themes/rimobi/css/rimobi-min.css">
  <link rel="stylesheet" href="/themes/rimobi/css/blueimp-gallery.min.css">
  <link rel="stylesheet" href="/themes/rimobi/css/bootstrap-image-gallery.min.css">
  {$site.css_token|cssOnline}
  {$performance.site.apple_touch_icon|appleTouchIcons}
  <!--[if lt IE 9]>
    <script src="themes/rimobi/js/ie/respond.min.js" cache="false"></script>
    <script src="themes/rimobi/js/ie/html5.js" cache="false"></script>
    <script src="themes/rimobi/js/ie/excanvas.js" cache="false"></script>
  <![endif]-->
</head>
<body>
<section id="content">
	<section class="main padder">
		<section class="error">
			<p style="text-align: center; margin-top: 100px;">
				<span>{$smarty.const.ERROR_MESSAGE|translate}</span>
			</p>
		</section>
	</section>
</section>
</body>
</html>
