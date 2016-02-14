(function() {
  'use strict';

  $(document).ready(onDocReady);

  function onDocReady() {
    $('#main').fullpage({
      autoScrolling: true,
      loopTop: true,
      loopBottom: true
    });

    var count = 5;
    var timer = setInterval(add, 2000);

    function add() {
      $('#main').append('<div class="section">Section wer</div>');
      $.fn.fullpage.reBuild();
    }
  }
}());
