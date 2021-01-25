
// spy-nvaに関してのスクリプト
// index.htmlだけに適応したい

var headerNavHeight = $('#header-nav').height();
var headerHeight = $('header').height();
var spyNavHeight = $('#spy-nav-bottom').height();
var spyStart = $('#spy-nav-bottom').offset().top; // 画面左端からのナビゲーション バーの座標を取得
var spyBttom = spyStart + spyNavHeight;
var distance = 0;
var monColor = 'rgb(194, 0, 0)';

// ずれ問題
  var a_height = headerNavHeight + spyNavHeight*3;
  $('a.nav-link').click(function (){
    var href = $(this).attr('href');
    var target = $(href == "#" || href == "" ? "body" : href);
    var position = target.offset().top - a_height;
    $('html, body').animate({ scrollTop: position }, 500, "swing");
    return false;
  });

$(document).scroll(function(){
  distance = $(this).scrollTop() + headerNavHeight;

  // fix navbar
  if(spyBttom <= distance){ // under position
    // 使わない
    // $('.spy-nav').addClass('fixed fixed-spy').css('top', headerNavHeight);
    // 使わない
    $('body').attr('data-offset', headerNavHeight+spyNavHeight);
    $.when(
      $('#header-nav').find('.tori-url').fadeOut(),
      $('#spy-nav-bottom').find('.nav-link').fadeOut()
    ).done(function(){
      $('#spy-nav-top').fadeIn();
    });
  }
  else if(spyBttom > distance){ // over position
    // 使わない
    // $('.spy-nav').removeClass('fixed fixed-spy').css('top', '0');
    // 使わない
    $('body').attr('data-offset', distance+spyNavHeight);
    $.when(
      $('#spy-nav-top').fadeOut()
    ).done(function(){
      $('#header-nav').find('.tori-url').fadeIn();
      $('#spy-nav-bottom').find('.nav-link').fadeIn();
    });
  }

  // hover
  // $('.spy-nav').find('.nav-link').hover(
  //   function(){
  //     $(this).css('filter', 'brightness(0.85)');
  //   },
  //   function(){
  //     $(this).css('filter', 'brightness(1.0)');
  //   }
  // );
});
