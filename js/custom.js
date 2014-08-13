!function ($) {
  $('#nav').on('click', 'a', function(){
      $('body').removeClass('slide-nav slide-nav-left');
  });
  if ( !(/(iPad|iPhone|iPod).*OS [6-7].*AppleWebKit.*Mobile.*Safari/.test(navigator.userAgent)) ) {
    console.log('cacete');
    $.smartbanner({
      daysHidden: 0,
      daysReminde: 0
    });
  }

}(window.jQuery);

