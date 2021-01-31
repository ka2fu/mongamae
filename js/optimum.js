/**
* 各駅の出発時間（区間の駅情報）を取得するのに必要な経路シリアライズデータを取得する
* @param {string} arg - 出発駅:経由駅:到着駅
* @return {string} - 経路シリアライズデータ
*/
function getRoute(arg){
  const params = `&searchType=lastTrain&viaList=${arg}`;
  const type = "/search/course/extreme";
  const url = buildEkiUrl(type, params);
  return fetch(url)
  .then(res => {
    const result = res.json();
    return result;
  })
  .then(result => {
    const serialize_data = result.ResultSet.Course[0].SerializeData;
    return serialize_data;
  })
  .catch(error => {
    return error;
  })

}

/**
* 経路シリアライズデータを元に区間の駅情報を取得し、時間を取得する。それを、駅名と共にハッシュに加工してreturnする。
* @param {string} arg - 経路シリアライズデータ
* @param {string} second_station - 乗り換え駅A（最適駅の可能性は無いので、ハッシュに入れたくない。）
* @param {string} temp_optimum_i - 今調べてる仮最適駅（最適駅の可能性があるというか高すぎるので、ハッシュに絶対に入れなければいけない。）
* @return {hash} - 駅名:時間 のハッシュ
*/
function getEachDeparture(arg, second_station, temp_optimum_i){
  const params = `&sectionIndex=1&serializeData=${arg}`;  //sectionIndexは何本目に乗る列車か、ということ。今回はsectionIndex=1のみ取れば比較できる。
  const type = "/course/station";
  const url = buildEkiUrl(type, params);
  return fetch(url)
  .then(res => {
    const result = res.json();
    return result;
  })
  .then(result => {
    const each_departure = {};
    let departure_state;
    //console.log(result.ResultSet);
    for(let i=0; i < result.ResultSet.Point.length - 1; i++){
      const point = result.ResultSet.Point[i].Station.Name; //今調べている駅の名前
      //console.log(point);
      if(point == second_station){  //pointが乗換駅Aだったときはbreak
        break;
      }else if(point == temp_optimum_i){  //pointが最適駅だったときは、hashに値を入れてからbreak
        if(Array.isArray(result.ResultSet.Line) == true){ //APIのレスポンスであるLineが複数あって配列になっているときとなっていないときで場合分け
          departure_state = result.ResultSet.Line[i].DepartureState.Datetime.text;
        }else{
          departure_state = result.ResultSet.Line.DepartureState.Datetime.text;
        }
        each_departure[point] = departure_state;  //ハッシュに挿入
        break;
      }else{  //pointが乗換駅Aでも最適駅でもないとき
        if(Array.isArray(result.ResultSet.Line) == true){ //以下、上と同じ
          departure_state = result.ResultSet.Line[i].DepartureState.Datetime.text;
        }else{
          departure_state = result.ResultSet.Line.DepartureState.Datetime.text;
        }
        each_departure[point] = departure_state;
      }
    }
    return each_departure;
  });
}

/**
* 0時台や1時台の時間を24時や25時に変換する
* @param {string} time - 変換前の時間
* @return {string} - 変換後の時間
*/
function formTime(time){

  //console.log("formtime前 time", time)

  let hour = time.slice(0,2);
  hour = Number(hour)
  if(hour < 3){
    hour = 24 + hour;
    let remain = time.slice(2); //分以下の残り
    hour = String(hour);
    result = hour + remain;
    return result;
  }else{
    return time;
  }


}



/**
* 仮最適から最適駅を導出するメイン関数 【重要】nodes関係をいじるときはtemp_optimum[i]を使うこと！！
* @param {array} temp_optimum - 仮最適駅の配列
* @return {string} - 最適駅
*/
async function findOptimum(temp_optimum){
  let optimum = [];
  for(let i=0; i<temp_optimum.length; i++){
    priority = [];

    for(let j=0; j<eki_names.length; j++){
      let formed_eki_names = formDiffTransfer(eki_names[j])
      setPriority([temp_optimum[i], formed_eki_names, nodes[formed_eki_names][temp_optimum[i]].cost])
    }
    let first_station = priority[priority.length-1][1] // 一番早く出る検索駅(検索駅A)
    let previous_transfer = nodes[first_station][temp_optimum[i]].previousNode.ekispert; // ↑のもとに、乗り換え駅Aを調べる
    let original_second_station = priority[priority.length-2][1] //二番目に早く出る検索駅(検索駅B)

    let temp_optimum_i = nodes[first_station][temp_optimum[i]].ekispert;

    let original_first_station = first_station
    first_station = nodes[first_station][first_station].ekispert;
    let second_station = nodes[original_second_station][original_second_station].ekispert;





    let serialize_data;

    if(previous_transfer!=first_station){
      //console.log(temp_optimum_i+":"+previous_transfer+":"+first_station);
      serialize_data = await getRoute(temp_optimum_i+":"+previous_transfer+":"+first_station); //仮最適から検索駅AのSerializeData
    }else{
      //console.log(temp_optimum_i+":"+first_station);
      serialize_data = await getRoute(temp_optimum_i+":"+first_station); //仮最適から検索駅AのSerializeData
    }

    let each_dep_TempToFirst = await getEachDeparture(serialize_data, previous_transfer, null); //同途中駅と出発時刻
    //console.log(each_dep_TempToFirst);
    if(temp_optimum_i!=second_station){
      //console.log(previous_transfer+":"+temp_optimum_i+":"+second_station);
      serialize_data = await getRoute(previous_transfer+":"+temp_optimum_i+":"+second_station); //乗り換え駅Aから検索駅BのSerializeData
    }else{
      //console.log(previous_transfer+":"+second_station);
      serialize_data = await getRoute(previous_transfer+":"+second_station); //乗り換え駅Aから検索駅BのSerializeData
    }

    let each_dep_PreToSecond = await getEachDeparture(serialize_data, null, temp_optimum_i); //同途中駅と出発時刻
    //console.log(each_dep_PreToSecond);

   //console.log("original_second_station",original_second_station);
    //console.log("temp_optimum[i]",temp_optimum[i]);

    let cost_TempToSecond = nodes[original_second_station][temp_optimum[i]].cost //仮最適から乗り換え駅Bへの出発時刻を取得

    //console.log("slice前",cost_TempToSecond)

    if(cost_TempToSecond!="start"){
    cost_TempToSecond = cost_TempToSecond.slice(11); //時刻のフォーマットを揃える

    //console.log("slice後formtime前",cost_TempToSecond)

    each_dep_PreToSecond[temp_optimum_i] = formTime(cost_TempToSecond); //仮最適から乗り換え駅Bへの出発時刻をeach_dep_PreToSecondに追加

  }else{
    each_dep_PreToSecond[temp_optimum_i] = cost_TempToSecond; //仮最適から乗り換え駅Bへの出発時刻をeach_dep_PreToSecondに追加
  }
    //console.log("temptofirst", each_dep_TempToFirst);
    //console.log("pretosecond", each_dep_PreToSecond);

    /* 以下、それぞれの駅の時間比較 */

    let for_comparison = []; //0:駅名, 1:発車時刻  -- 現時点での一番良い駅の一時保存用
    for (let key in each_dep_TempToFirst) { //それぞれのキー（駅名）ごとに繰り返し

      //以下、赤線の駅が違う場合の処理
      if(each_dep_PreToSecond[key]==undefined){
        for_comparison = [];
        for_comparison[0] = temp_optimum[i];
        if(nodes[original_second_station][temp_optimum[i]].cost!="start"&&nodes[original_first_station][temp_optimum[i]].cost!="start"){
          if(nodes[original_first_station][temp_optimum[i]].cost > nodes[original_second_station][temp_optimum[i]].cost){
            for_comparison[1] = nodes[original_second_station][temp_optimum[i]].cost;
          }else{
            for_comparison[1] = nodes[original_first_station][temp_optimum[i]].cost;
          }
        }else if(nodes[original_second_station][temp_optimum[i]].cost=="start"){
          for_comparison[1] = nodes[original_first_station][temp_optimum[i]].cost;
        }else{
          for_comparison[1] = nodes[original_second_station][temp_optimum[i]].cost;
        }

        for_comparison[1] = for_comparison[1].slice(11); //時間のフォーマット揃える
        for_comparison[1] = formTime(for_comparison[1]);

        break;

      //赤線の駅が違う場合の処理終了

      }else{
        if(for_comparison.length == 0){
          for_comparison.push(key);
          if(each_dep_TempToFirst[key] == ""){
            for_comparison.push(formTime(each_dep_PreToSecond[key]));
          }else if(each_dep_PreToSecond[key] == ""){
            for_comparison.push(formTime(each_dep_TempToFirst[key]));
          }else if(formTime(each_dep_TempToFirst[key]) > formTime(each_dep_PreToSecond[key])){
            for_comparison.push(formTime(each_dep_PreToSecond[key]));
          }else if(formTime(each_dep_TempToFirst[key]) <= formTime(each_dep_PreToSecond[key])){
            for_comparison.push(formTime(each_dep_TempToFirst[key]));
          }
        }else{  //一旦for_comparisonに早い時間を入れて、既存のものと比較してどちらかを捨てる方法を取っています。
          if(each_dep_TempToFirst[key] == ""){
            for_comparison.push(formTime(each_dep_PreToSecond[key]));
          }else if(each_dep_PreToSecond[key] == ""){
            for_comparison.push(formTime(each_dep_TempToFirst[key]));
          }else if(formTime(each_dep_TempToFirst[key]) > formTime(each_dep_PreToSecond[key])){
            for_comparison.push(formTime(each_dep_PreToSecond[key]));
          }else if(formTime(each_dep_TempToFirst[key]) <= formTime(each_dep_PreToSecond[key])){
            for_comparison.push(formTime(each_dep_TempToFirst[key]));
          }
          if(for_comparison[1] > for_comparison[2]){
            for_comparison.pop();
          }else if(for_comparison[1] <= for_comparison[2]){
            for_comparison.splice(1,1);
            for_comparison[0] = key;
          }
        }
      }
    }
    optimum.push(for_comparison); //仮最適駅が複数ある場合があるから、それぞれの仮最適駅周辺の最適駅をプッシュ。
  }

  /* いくつかある最駅駅候補の比較 */
  let k = 1;
  while(optimum.length > k){
    if(optimum[k-1][1] > optimum[k][1]){
      optimum.splice(k, 1);
    }else if(optimum[k-1][1] < optimum[k][1]){
      optimum.splice(0, k);
      k = 1;
    }else{
      k++;
    }
  }
  return optimum;
}
