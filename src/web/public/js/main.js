(function(window, $, _) {

  'use strict';

  $(document).ready(onDocumentReady);
  function onDocumentReady() {

    // init - slideshow tag
    var tag = window.tag;
    if(!tag) { throw new Error('window.tag is required!'); }

    // init - ui things
    var c = new VCarousel({
      selector: '#carousel',
      interval: 5000,
    });

    // init - load initial photo data
    getPhotos(tag, 0, function(photos) {
      c.setData(photos);
    });

    // init - load latest
    window.getData = c.getData;
    window.update = function() {
      var data = c.getData();
      var latest = data[0];
      var since = latest.created.valueOf();
      getPhotos(tag, since, function(photos) {
        c.addData(photos);
      });
    };
  }

  // helper - calls photos api
  var first = true;
  function getPhotos(tag, since, callback) {
    var url = '/api/photos?limit=5&s='+ tag + '&since=' + (since || 0);
    if(first) { url += '&skip=1'; }
    first = false;
    $.get(url, function(data) {
      var photos = _.map(data, function(p) {
        return {
          by: p.by,
          url: _.last(p.images).url,
          caption: p.caption,
          created: new Date(p.created)
        };
      });
      callback(photos);
    });
  }

}(window, jQuery, _));
