
$('#wrapper').on('click', '.title', function(){
  $.when(
    $('.title-inner').fadeOut()
  ).done(function(){
    $('#ppl-inner').removeClass('hidden');
    $('#ppl-inner').fadeIn();
  });
});

// いろいろなスマホタッチ処理
$('.hovable-moya').on({ // ←innerじゃないよ
  'touchstart' : function(){
    $(this).off('mouseover mouseout');
  },
  'touchstart mouseover' : function(){
    $(this).css('opacity', 0.8);
  },
  'touchend mouseout' : function(){
    $(this).css('opacity', 1.0);
  }
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
  if(!($('body').hasClass('index'))){ // トップページでない場合
    $('#header-wrapper').animate({
      backgroundColor: "transparent"
      // backgroundColor: "rgba(255, 255, 255, 0.5)"
    }, {
      duration: 600,
      easing: "easeInCubic",
      queue: false
    });
    $('#modal').animate({
      backgroundColor: "transparent"
      // backgroundColor: "rgba(255, 255, 255, 0.5)"
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
  });
});

// むしめがねモーダルの開閉
$('#mushimegane').on('click', '.moya', function(){
  if($('#mushi-modal').hasClass('hidden')){
    $('#mushi-modal').hide();
    $('#mushi-modal').removeClass('hidden');
  }
  $('#mushi-modal').fadeIn();
});
$('#mushi-modal').on('click', '#close', function(){
  $('#mushi-modal').fadeOut();
});

// クリックでいい感じの位置にいくための
let header_height = $('#header-wrapper').height();
let space = header_height * 2;
let a_height = header_height + space;
$('.mushi-link').click(function(){
  let href = $(this).attr('href');
  $('#mushi-modal').fadeOut(); // 連続でクリックするとなんかバグるし、ui的にも消したい
  let target = $(href == "#" || href == "" ? "body" : href);
  let position = target.offset().top - a_height;
  $('html, body').animate({ scrollTop:position }, 500, "swing");
  return false;
});

// info-outerの中のfooterの位置を整える
let title_height = $('.info-inner').offset().top - $('#info-outer').offset().top;
let footer_pos = $('.info-inner').height() + title_height;
let footer = $('#info-outer').find('footer');
$(footer).css('top', footer_pos);
$(footer).removeClass('hidden'); // リフレッシュで一瞬現れるの防止で隠す
$(document).scroll(function(){ // 一応画面幅が途中で変わっとトキのために
  let title_height = $('.info-inner').offset().top - $('#info-outer').offset().top;
  let footer_pos = $('.info-inner').height() + title_height;
  let footer = $('#info-outer').find('footer');
  $(footer).css('top', footer_pos);
});
