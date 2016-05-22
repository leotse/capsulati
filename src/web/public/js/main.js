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

    // init refresh timer
    var timer = setInterval(getLatest, 60000);

    // init - load initial photo data
    getPhotos(tag, 0, function(photos) {
      c.setData(photos);
    });

    // helper - calls photos api
    function getPhotos(tag, since, callback) {
      var url = '/api/photos?s='+ tag + '&since=' + (since || 0);
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

    // helper - get latest photos
    function getLatest() {
      console.log(new Date(), 'get latest');
      var data = c.getData();
      var latest = data[0];
      var since = latest.created.valueOf();
      getPhotos(tag, since, function(photos) {
        c.addData(photos);
      });
    }
  }
}(window, jQuery, _));
