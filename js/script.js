

var headerNavHeight = $('#header-nav').height();
var headerHeight = $('header').height();
var spyNavHeight = $('#spy-nav-bottom').height();
var spyTopHeight = $('#spy-nav-top').height();
var spyStart = $('#spy-nav-bottom').offset().top; // 画面左端からのナビゲーション バーの座標を取得
var spyBttom = spyStart + spyNavHeight;
var distance = 0;
var monColor = 'rgb(194, 0, 0)';


$(function(){

  // linkいたずら
  let vanish = $('.vanish');
  $(vanish).click(() => {
    $(vanish).fadeOut(() => {
      $('.thx').fadeIn();
    });
  });

  // tori変化
  let insta_url = 'img/tori-insta.png';
  let tube_url = 'img/tori-tube.png';
  let note_url = 'img/tori-note.png';
  let twi_url = 'img/tori-twi.png';
  let kane_url = 'img/tori-kane.png';
  let moto_url = 'img/tori-moto.png';
  $('.tori').on({
    'touchstart' : function(){
      $(this).off('mouseover mouseout');
    },
    'touchstart mouseover' : function(){
      $(this).find('img').attr('src', moto_url);
    },
    'touchend mouseout' : function(){
      if($(this).hasClass('insta')){
        $(this).find('img').attr('src', insta_url);
      }
      else if($(this).hasClass('tube')){
        $(this).find('img').attr('src', tube_url);
      }
      else if($(this).hasClass('note')){
        $(this).find('img').attr('src', note_url);
      }
      else if($(this).hasClass('twi')){
        $(this).find('img').attr('src', twi_url);
      }
      else if($(this).hasClass('pring')){
        $(this).find('img').attr('src', kane_url);
      }
    }
  });

  // modal
  $('#modal').hide();
  $('nav').on('click', '#open', function (){
    $('#open').fadeOut(1, function (){
      $('#modal').slideDown();
    });
  });
  $('#modal').on('click', '#close', function (){
    $('#modal').slideUp(function (){
      $('#open').show();
    })
  })

  // button in modal
  $('.plus').click(function(){
    let link = $(this).parent().parent();
    $(this).hide();
    $(link).find('.minus').show(function(){
      $(link).find('.modal-link-contents').slideDown();
    });
  });
  $('.minus').click(function(){
    let link = $(this).parent().parent();
    $(this).hide();
    $(link).find('.plus').show(function(){
      $(link).find('.modal-link-contents').slideUp();
    });
  });

  // ずれ問題
  var a_height = headerNavHeight + spyNavHeight*2;
  $('a.nav-link').click(function (){
    var href = $(this).attr('href');
    var target = $(href == "#" || href == "" ? "body" : href);
    var position = target.offset().top - a_height;
    $('html, body').animate({ scrollTop: position }, 500, "swing");
    return false;
  });
});
