(function(window, $, _) {

  'use strict';

  function VCarousel(opts) {

    // init - internal control states
    var $carousel = $(opts.selector);
    var $items = $carousel.find('.item');
    var $active = $carousel.find('.item.active');
    var $bg = $carousel.find('.background');

    var size = $items.size();
    var animating = false;
    var data = [];
    var index = 0;

    // init - carousel events
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

    // public - get current data
    this.getData = function() {
      return data;
    };

    // public - add data
    this.setData = function(newData) {
      data = newData;

      if(data && data.length > 0) {
        // init first slide
        var domIndex = $carousel.find('.item.active').index();
        $items[domIndex].innerHTML = createImageHTML(data[0].url);

        // update background
        setBG(data[0].url);
      }
    };

    // public - prepend data
    this.addData = function(newData) {
      if(newData && newData.length > 0) {
        data = newData.concat(data);
        index += newData.length;
        console.log('added data', data, index);
      }
    };

    // private - next slide
    function next() {
      if(animating) { return; }

      // update internal states
      animating = true;
      index++;
      if(index >= data.length) { index = 0; }

      // find and update next dom element
      var domIndex = $carousel.find('.item.active').index() + 1;
      $items[domIndex % size].innerHTML = createImageHTML(data[index].url);

      // and slide!
      setBG(data[index].url);
      $carousel.carousel('next');
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

}(window, jQuery, _));
