(function() {
  'use strict';

  // internal control states
  var animating = false;
  var index = 0;
  var size = 3;

  // internal dom refs
  var $carousel, $prev, $next, $items, $active;

  // init control when doc ready!
  $(document).ready(initCarousel);

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

  // helper- init carousel
  function initCarousel() {

    // init dom refs
    $prev = $('#prev');
    $next = $('#next');
    $carousel = $('#carousel');
    $items = $('#carousel .carousel-inner .item');
    $active = $('#carousel .carousel-inner .item.active');

    // init internal states
    size = $items.size();
    index = $active.index();
    $active.text('item ' + index);

    // init carousel
    $carousel.carousel({
      interval: 0,
      keyboard: true
    });

    $carousel.on('slid.bs.carousel', function() {
      animating = false;
    });

    // init carousel controls
    $prev.on('click', prev);
    $next.on('click', next);
  }
}());
