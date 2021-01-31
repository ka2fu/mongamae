

var monColor = 'rgb(194, 0, 0)';


// modalを隠す
$('#modal').hide();

$(function(){

  // linkいたずら
  let vanish = $('.vanish');
  $(vanish).click(() => {
    $(vanish).fadeOut(() => {
      $('.thx').fadeIn();
    });
  });

  /* sp/tbの時のタッチ効果 */
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
  // lpの作品のとこ 保留
  // $('.works-item').on({
  //   'touchstart' : function(){
  //     $(this).off('mouseover mouseout');
  //   },
  //   'touchstart mouseover' : function(){
  //     $(this).find('.works-bg').animate({
  //       opacity: 0.8
  //     }, {
  //       duaration: 200,
  //       specialEasing: {
  //         transform: "easeOutQuad"
  //       }
  //     });
  //   },
  //   'touchend mouseout' : function(){
  //     $(this).find('.works-bg').animate({
  //       opacity: 1.0
  //     }, {
  //       duaration: 200,
  //       specialEasing: {
  //         transform: "easeOutQuad"
  //       }
  //     });
  //   }
  // });

  // modal
  $('nav').on('click', '#open', function (){
    // $('#open').fadeOut(1, function (){
    //   $('#modal').slideDown();
    // });
    $('#open').fadeOut();
    $('#header-wrapper').addClass('border-inherit');
    $('#modal').slideDown();
  });
  $('#modal').on('click', '#close', function (){
    $('#modal').slideUp(function (){
      $('#header-wrapper').removeClass('border-inherit');
      $('#open').fadeIn();
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
});
