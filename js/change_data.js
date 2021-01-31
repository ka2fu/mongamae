//実行する関数は下の方にあります

function getSta(){
  var url = "https://api-tokyochallenge.odpt.org/api/v4/odpt:Station?acl:consumerKey=RNN8c5hZf4Pa0HxqR6mszHzOBTdxIsD17RKFoxuDQik";
  return fetch(url)
  .then(res => {
    const result = res.json();
    return result;
  })
  .then(json => {
      //console.log(json);
    return json;
  })
  .catch(error => {
    return error;
  })

}

//個別に取らなきゃいけない路線用の関数
function getLineSta(rail){
var url = `https://api-tokyochallenge.odpt.org/api/v4/odpt:Station?${rail}acl:consumerKey=RNN8c5hZf4Pa0HxqR6mszHzOBTdxIsD17RKFoxuDQik`;
return fetch(url)
.then(res => {
  const result = res.json();
  return result;
})
.then(json => {
    //console.log(json);
  return json;
})
.catch(error => {
  return error;
})

}

function getRosen(){
  var url = "https://api-tokyochallenge.odpt.org/api/v4/odpt:Railway?acl:consumerKey=RNN8c5hZf4Pa0HxqR6mszHzOBTdxIsD17RKFoxuDQik";
  return fetch(url)
  .then(res => {
    const result = res.json();
    return result;
  })
  .then(json => {
      //console.log(json);
    return json;
  })
  .catch(error => {
    return error;
  })

}


/**
* 駅情報を取得し、路線毎に並び替える
* @return {array} rosen.stations - 路線のハッシュの中に、路線の並び順に駅が入っている
*/

async function getEkiData(){

  var ekidata = [];
  var eki = await getSta();
  var rosen = await getRosen();

  //書き方が頭悪いですが、foreachを使えたので少しは成長しました(本当はforEachの入れ子ループにすべき？)
  var eki_kari_okiba = await getLineSta("odpt:operator=odpt.Operator:TokyoMetro&");
  eki_kari_okiba.forEach(element => {
    eki.push(element);
  });
  eki_kari_okiba = await getLineSta("odpt:operator=odpt.Operator:JR-East&");
  eki_kari_okiba.forEach(element => {
    eki.push(element);
  });
  eki_kari_okiba = await getLineSta("odpt:operator=odpt.Operator:Keisei&");
  eki_kari_okiba.forEach(element => {
    eki.push(element);
  });
  eki_kari_okiba = await getLineSta("odpt:operator=odpt.Operator:Sotetsu&");
  eki_kari_okiba.forEach(element => {
    eki.push(element);
  });
  eki_kari_okiba = await getLineSta("odpt:operator=odpt.Operator:Tobu&");
 eki_kari_okiba.forEach(element => {
   eki.push(element);
 });
 eki_kari_okiba = await getLineSta("odpt:operator=odpt.Operator:Keikyu&");
 eki_kari_okiba.forEach(element => {
   eki.push(element);
 });

  var eki_name;
  var rosen_name;

  for(var i=0; i<rosen.length; i++){
    rosen_name = rosen[i]["owl:sameAs"];
      if(rosen[i]["odpt:stationOrder"].length!=0){
        ekidata[rosen_name] = [];
          for(var j=0; j<rosen[i]["odpt:stationOrder"].length; j++){
              eki_name = rosen[i]["odpt:stationOrder"][j]["odpt:station"];
              for(var k=0; k<eki.length; k++){
                  if(eki_name == eki[k]["owl:sameAs"]){
                      ekidata[rosen_name].push(eki[k]);
                      break;
                  }
              }
          }
      }

  }

  //京葉線支線
  let nishifuna = ekidata["odpt.Railway:JR-East.Keiyo"][9]; //西船橋駅
  ekidata["odpt.Railway:JR-East.Keiyo"].splice(9, 1); //西船橋削除
  let ichishio = ekidata["odpt.Railway:JR-East.Keiyo"][8]; //市川塩浜駅
  let minafuna = ekidata["odpt.Railway:JR-East.Keiyo"][10]; //南船橋駅

  //高谷支線
  ekidata["odpt.Railway:JR-East.KeiyoKoyaBranch"] = [];
  ekidata["odpt.Railway:JR-East.KeiyoKoyaBranch"][0] = ichishio;
  ekidata["odpt.Railway:JR-East.KeiyoKoyaBranch"][0]["odpt:railway"] = "odpt.Railway:JR-East.KeiyoKoyaBranch";
  ekidata["odpt.Railway:JR-East.KeiyoKoyaBranch"][0]["odpt:connectingRailway"] = [];
  ekidata["odpt.Railway:JR-East.KeiyoKoyaBranch"][0]["odpt:connectingRailway"][0] = "odpt.Railway:JR-East.Keiyo";
  ekidata["odpt.Railway:JR-East.KeiyoKoyaBranch"][1] = nishifuna;
  ekidata["odpt.Railway:JR-East.KeiyoKoyaBranch"][1]["odpt:railway"] = "odpt.Railway:JR-East.KeiyoKoyaBranch";


  //二俣支線
  ekidata["odpt.Railway:JR-East.KeiyoFutamataBranch"] = [];
  ekidata["odpt.Railway:JR-East.KeiyoFutamataBranch"][0] = minafuna;
  ekidata["odpt.Railway:JR-East.KeiyoFutamataBranch"][0]["odpt:railway"] = "odpt.Railway:JR-East.KeiyoFutamataBranch";
  ekidata["odpt.Railway:JR-East.KeiyoFutamataBranch"][0]["odpt:connectingRailway"] = [];
  ekidata["odpt.Railway:JR-East.KeiyoFutamataBranch"][0]["odpt:connectingRailway"][0] = "odpt.Railway:JR-East.Keiyo";
  ekidata["odpt.Railway:JR-East.KeiyoFutamataBranch"][1] = nishifuna;
  ekidata["odpt.Railway:JR-East.KeiyoFutamataBranch"][1]["odpt:railway"] = "odpt.Railway:JR-East.KeiyoFutamataBranch";


  //西船橋のconnectingRailway変更
  ekidata["odpt.Railway:JR-East.ChuoSobuLocal"][9]["odpt:connectingRailway"][0] = "odpt.Railway:JR-East.KeiyoKoyaBranch";
  ekidata["odpt.Railway:JR-East.ChuoSobuLocal"][9]["odpt:connectingRailway"][5] = "odpt.Railway:JR-East.KeiyoFutamataBranch";
  ekidata["odpt.Railway:JR-East.Musashino"][25]["odpt:connectingRailway"][1] = "odpt.Railway:JR-East.KeiyoKoyaBranch";
  ekidata["odpt.Railway:JR-East.Musashino"][25]["odpt:connectingRailway"][5] = "odpt.Railway:JR-East.KeiyoFutamataBranch";
  ekidata["odpt.Railway:Keisei.Main"][19]["odpt:connectingRailway"][1] = "odpt.Railway:JR-East.KeiyoKoyaBranch";
  ekidata["odpt.Railway:Keisei.Main"][19]["odpt:connectingRailway"][5] = "odpt.Railway:JR-East.KeiyoFutamataBranch";
  ekidata["odpt.Railway:TokyoMetro.Tozai"][22]["odpt:connectingRailway"][1] = "odpt.Railway:JR-East.KeiyoKoyaBranch";
  ekidata["odpt.Railway:TokyoMetro.Tozai"][22]["odpt:connectingRailway"][5] = "odpt.Railway:JR-East.KeiyoFutamataBranch";

  return ekidata;
}
