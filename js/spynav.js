
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
  var a_height = headerNavHeight + spyNavHeight*1;
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
    $('body').attr('data-offset', headerNavHeight+spyNavHeight);
    $.when(
      $('#header-nav').find('.tori-url').fadeOut(),
      $('#spy-nav-bottom').find('.nav-link').fadeOut()
    ).done(function(){
      $('#spy-nav-top').fadeIn();
    });
  }
  else if(spyBttom > distance){ // over position
    $('body').attr('data-offset', distance+spyNavHeight);
    $.when(
      $('#spy-nav-top').fadeOut()
    ).done(function(){
      $('#header-nav').find('.tori-url').fadeIn();
      $('#spy-nav-bottom').find('.nav-link').fadeIn();
    });
  }
});
