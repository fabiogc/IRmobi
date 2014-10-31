!function ($) {
  $('#nav').on('click', 'a', function() {
      var link = $(this);
      var next = link.next('ul.dropdown-menu');
      if (next.length) {
        var hidden = next.is(':hidden');
        console.log(hidden);
        $('#nav ul.dropdown-menu:visible').hide(100, 'swing');
        if (hidden)
          next.show(200, 'swing');
      } else {
        $('body').removeClass('slide-nav slide-nav-left');
      }
  });
}(window.jQuery);

