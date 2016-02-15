(function($) {

  'use strict';

  function VCarousel(opts) {

    // init - internal control states
    var $carousel = $(this);
    var $items = $carousel.find('.item');
    var $active = $carousel.find('.item.active');
    var $prev = $(opts.prev);
    var $next = $(opts.next);

    var size = $items.size();
    var index = $active.index();
    var animating = false;

    $active.text('item ' + index);

    // init - carousel events
    $prev.on('click', prev);
    $next.on('click', next);
    $carousel.on('slid.bs.carousel', function() {
      animating = false;
    });

    // init - finally create the underlying bootstrap carousel!
    $carousel.carousel(opts);

    // helper - prev slide
    function prev() {
      if(animating ||index === 0) { return; }
      animating = true;
      index--;
      $items[index % size].innerText = 'item ' + index;
      $carousel.carousel('prev');
    }

    // helper - next slide
    function next() {
      if(animating) { return; }
      animating = true;
      index++;
      $items[index % size].innerText = 'item ' + index;
      $carousel.carousel('next');
    }
  }

  // register jquery plugin
  $.fn.vcarousel = VCarousel;

}(jQuery));
