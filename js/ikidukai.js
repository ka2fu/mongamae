
$('#wrapper').on('click', '.title', function(){
  $.when(
    $('.title-inner').fadeOut()
  ).done(function(){
    $('#ppl-inner').removeClass('hidden');
    $('#ppl-inner').fadeIn();
  });
});


// modalの開閉
$('nav').on('click', '#open', function (){
  if($('#modal').hasClass('hidden')){ // modalの顔一瞬出てくる現象抑制　
    $('#modal').hide();
    $('#modal').removeClass('hidden');
  }

  $('#open').fadeOut();
  $('#header-wrapper').addClass('border-inherit');
  $('#modal').slideDown();

  // modalを開く時背景色を変更
  $('#header-wrapper').animate({
    backgroundColor: "rgba(255, 255, 255, 0.9)"
  }, {
    duration: 600,
    easing: "easeOutCubic",
    queue: false
  });
  $('#modal').animate({
    backgroundColor: "rgba(255, 255, 255, 0.9)"
  }, {
    duration: 600,
    easing: "easeOutCubic",
    queue: false
  });
});
$('#modal').on('click', '#close', function (){

  // modalを閉じる時背景色を戻す
  if(!($(this).hasClass('in-top'))){ // トップページでない場合
    $('#header-wrapper').animate({
      backgroundColor: "rgba(255, 255, 255, 0.5)"
    }, {
      duration: 600,
      easing: "easeInCubic",
      queue: false
    });
    $('#modal').animate({
      backgroundColor: "rgba(255, 255, 255, 0.5)"
    }, {
      duration: 600,
      easing: "easeInCubic",
      queue: false
    });
  } else { // トップメージの場合
    $('#header-wrapper').animate({
      backgroundColor: "transparent"
    }, {
      duration: 600,
      easing: "easeInCubic",
      queue: false
    });
    $('#modal').animate({
      backgroundColor: "transparent"
    }, {
      duration: 600,
      easing: "easeInCubic",
      queue: false
    });
  }

  $('#modal').slideUp(function (){
    $('#header-wrapper').removeClass('border-inherit');
    $('#open').fadeIn();
  })
})
