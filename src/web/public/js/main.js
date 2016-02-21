(function() {
  'use strict';

  $(document).ready(onDocumentReady);

  function onDocumentReady() {

    // init carousel
    var c = new VCarousel({
      selector: '#carousel',
      prev: '#prev',
      next: '#next',
      interval: 0
    });

    // init carousel data
    $.getJSON('/api/instagram/tags/snowy', function(res) {
      c.setData(res.data);
    });
  }
}());
