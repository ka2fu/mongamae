
$('#wrapper').on('click', '.title', function(){
  $.when(
    $('.title-inner').fadeOut()
  ).done(function(){
    $('#ppl-inner').removeClass('vanished');
    $('#ppl-inner').fadeIn();
  });
});
