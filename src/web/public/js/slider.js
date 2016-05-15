;(function($) {

  $(document).ready(function() {

    // get latest photos
    $.get('/api/photos?s=helloworld', function(data) {
      var photos = _.map(data, function(p) {
        return {
          by: p.by,
          url: p.images[2].url,
          caption: p.caption,
          created: p.created
        };
      });
    });

    // init - slideshow
    $('#slideshow').slippry({
      // general elements & wrapper
      slippryWrapper: '<div class="sy-box pictures-slider" />', // wrapper to wrap everything, including pager

      // options
      adaptiveHeight: false, // height of the sliders adapts to current slide
      captions: 'below', // Position: overlay, below, custom, false

      // pager
      pager: false,

      // controls
      controls: false,
      autoHover: false,

      // transitions
      transition: 'kenburns', // fade, horizontal, kenburns, false
      kenZoom: 0,
      speed: 5000 // time the transition takes (ms)
    });

  });

}(jQuery));
