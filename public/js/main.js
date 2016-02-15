(function() {
  'use strict';

  $(document).ready(onDocumentReady);

  function onDocumentReady() {
    $('#carousel').vcarousel({
      interval: 0,
      prev: '#prev',
      next: '#next'
    });
  }
}());
