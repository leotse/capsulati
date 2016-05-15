(function($) {

  'use strict';

  $(document).ready(onDocumentReady);
  function onDocumentReady() {

    // init carousel
    var c = new VCarousel({
      selector: '#carousel',
      prev: '#prev',
      next: '#next',
      interval: 5000
    });

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
      c.setData(photos);
    });
  }
}(jQuery));
