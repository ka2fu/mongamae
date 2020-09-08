

var headerNavHeight = $('#header-nav').height();
var headerHeight = $('header').height();
var spyNavHeight = $('#spy-nav').height();
var spyStart = $('#spy-nav').offset().top;
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
  $('.insta').hover(
    function(){
      $(this).find('img').attr({
        src: 'img/tori-insta.png'
        // width: 4.5rem,
        // height: 4.5rem
      });
    },
    function(){
      $(this).find('img').attr({
        src: 'img/tori-moto.png'
        // width: 3.5rem,
        // height: 3.5rem
      });
    }
  );

  $('.tube').hover(
    function(){
      $(this).find('img').attr({
        src: 'img/tori-moto.png'
        // width: 4.5rem,
        // height: 4.5rem
      });
    },
    function(){
      $(this).find('img').attr({
        src: 'img/tori-tube.png'
        // width: 3.5rem,
        // height: 3.5rem
      });
    }
  );

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
    if(spyStart <= distance){
      $('#spy-nav').addClass('fixed').css('top', headerNavHeight);
      $('body').attr('data-offset', headerNavHeight+spyNavHeight);
    }
    else if(spyStart >= distance){
      $('#spy-nav').removeClass('fixed').css('top', '0');
      $('body').attr('data-offset', distance+spyNavHeight);
    }

    // hover
    $('#spy-nav').find('li').hover(
      function (){
        if($(this).hasClass('spy-active')){
          $(this).css('filter', 'brightness(1.0)');
        } else {
          $(this).css('filter', 'brightness(0.9)');
        }
      },
      function (){
        $(this).css('filter', 'brightness(1.0)');
      }
    );
  });
});
