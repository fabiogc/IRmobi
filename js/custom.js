!function ($) {
  $('#nav').on('click', 'a', function() {
      var link = $(this);
      var next = link.next('ul.dropdown-menu');
      if (next.length) {
        next.toggle(200);
      } else {
        $('body').removeClass('slide-nav slide-nav-left');
      }
  });
}(window.jQuery);

