(function(window, $, _) {

  'use strict';

  $(document).ready(onDocumentReady);
  function onDocumentReady() {

    // init - slideshow tag
    var tag = window.tag;
    if(!tag) { throw new Error('window.tag is required!'); }

    // init - ui things
    var $bg = $('#background');
    var c = new VCarousel({
      selector: '#carousel',
      prev: '#prev',
      next: '#next',
      interval: 5000,
    });

    // init - get latest photos
    $.get('/api/photos?s=' + tag, function(data) {
      var photos = _.map(data, function(p) {
        return {
          by: p.by,
          url: _.last(p.images).url,
          caption: p.caption,
          created: p.created
        };
      });
      c.setData(photos);
    });
  }
}(window, jQuery, _));
