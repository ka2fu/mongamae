//入力されている駅の配列を返す関数
function getKensakuEkiArray(){
  var eki = document.getElementsByClassName('content');
  var stationList = [];
  for(var i=0; i<eki.length; i++){
    stationList.push(eki[i].value);
  }

  return stationList;

}


// ローディング表示
function showLoading(){
  let loading = '<div id="loading-inner"><div id="loading-icon"></div></div>';
  $('header').after(loading);
  $('#loading-inner').fadeIn();
}

function removeLoading(){
  $('#loading-inner').remove();
}


$(function(){

  $('#start_button').on('click', function(){

    $.when(
      $('#start').fadeOut()
    ).done(function() {
      $('#main').fadeIn()
    }).fail(function() {
      // エラーが発生したときの処理
    });
});


  var cnt = 2;
  var inputRow = `<li class="box" id="box${cnt}"><input type="text" class="content home-station"></li>`;
  // original html and added html defer in design
  function setBox(){
    cnt = 1;
    $('#boxes').append(inputRow);
    cnt = 2;
    $('#boxes').append(inputRow);
  }

  setBox();

  // add list
  $('#add_del').on('click', '.add', function(){
    cnt++;
    var inputRow = `<li class="box" id="box${cnt}"><input type="text" class="content home-station"></li>`;
    $('#boxes').append(inputRow);

  });

  // delete list
  $('#add_del').on('click', '.del', function(){
    if(cnt>2){
      var boxid = '#box'+cnt
      $(boxid).remove();
      cnt--;
    }
  });
});

function displayResult(message = null){
  const result_message = (message === null) ? "<p>最適な駅は...</p>" : `<p><span class="error">エラー</span><br>${message}</p>`; // 結果に表示するメッセージを変える

  $('#result-inner').prepend(result_message);

  for(let i in optimum_station){
    const station = optimum_station[i][0];
    const departure = optimum_station[i][1].slice(0,5);
    const elm = `<li class="results"><p class="station">${station}</p><p class="departure">${departure} 発</p></li>`;
    $('#result-inner').append(elm);
  }
  $('#result').show();
}
