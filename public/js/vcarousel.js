(function(window, $) {

  'use strict';

  function VCarousel(opts) {

    // init - internal control states
    var $carousel = $(opts.selector);
    var $items = $carousel.find('.item');
    var $active = $carousel.find('.item.active');
    var $prev = $(opts.prev);
    var $next = $(opts.next);

    var size = $items.size();
    var index = $active.index();
    var animating = false;
    var data = [];

    // init - carousel events
    $prev.on('click', prev);
    $next.on('click', next);
    $carousel.on('slid.bs.carousel', function() {
      animating = false;
    });

    // init - finally create the underlying bootstrap carousel!
    $carousel.carousel(opts);

    // public - add data
    this.setData = function(newData) {
      data = newData;

      // update dom
      $items[index % size].innerHTML = createImageHTML(data[index].images.standard_resolution.url);
    };

    // private - prev slide
    function prev() {
      if(animating || index === 0) { return; }
      animating = true;
      index--;
      $items[index % size].innerHTML = createImageHTML(data[index].images.standard_resolution.url);
      $carousel.carousel('prev');
    }

    // private - next slide
    function next() {
      if(animating || index + 1 >= data.length) { return; }
      animating = true;
      index++;
      $items[index % size].innerHTML = createImageHTML(data[index].images.standard_resolution.url);
      $carousel.carousel('next');
    }

    // private - create image tag
    function createImageHTML(url) {
      return '<div class="item-container"><img src="' + url + '" /></div>';
    }
  }

  // register jquery plugin
  window.VCarousel = VCarousel;

}(window, jQuery));
