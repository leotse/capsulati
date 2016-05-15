(function(window, $) {

  'use strict';

  function VCarousel(opts) {

    // init - internal control states
    var $carousel = $(opts.selector);
    var $items = $carousel.find('.item');
    var $active = $carousel.find('.item.active');
    var $bg = $carousel.find('.background');
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

    // init - slide timer
    var timer = null;
    if(_.isNumber(opts.interval) && opts.interval) {
      timer = setInterval(next, opts.interval);
    }

    // init - finally create the underlying bootstrap carousel!
    $carousel.carousel(opts);

    // public - add data
    this.setData = function(newData) {
      data = newData;

      // update dom
      $items[index % size].innerHTML = createImageHTML(data[index].url);

      // update background
      setBG(data[index].url);
    };

    // private - prev slide
    function prev() {
      if(animating || index === 0) { return; }
      animating = true;
      index--;
      $items[index % size].innerHTML = createImageHTML(data[index].url);
      $carousel.carousel('prev');
      setBG(data[index].url);
    }

    // private - next slide
    function next() {
      if(animating) { return; }
      if(index + 1 >= data.length) { index = -1;}
      animating = true;
      index++;
      $items[index % size].innerHTML = createImageHTML(data[index].url);
      $carousel.carousel('next');
      setBG(data[index].url);
    }

    // private - create image tag
    function createImageHTML(url) {
      return '<div class="item-container"><img src="' + url + '" /></div>';
    }

    // private - update background image
    function setBG(url) {
      $bg.attr('src', url);
    }
  }

  // register jquery plugin
  window.VCarousel = VCarousel;

}(window, jQuery));
