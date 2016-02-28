(function() {
  'use strict';

  $(document).ready(onDocumentReady);

  function onDocumentReady() {

    // init timezone
    $('.timezone').val(moment.tz.guess());

    // init datepickers
    $('.datepicker').datepicker();
    $('.input-daterange').datepicker({
      format: "yyyy-mm-dd",
      autoclose: true,
      todayHighlight: true
    });
  }
}());
