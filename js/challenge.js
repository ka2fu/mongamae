
console.log("remake works");

/**
* getCostから得られた
*/
function minCost(tmp_cost){
  let min = tmp_cost[0];

  tmp_cost.forEach(elm => {
    if(elm > min) min = elm;
  });

  return min;
}

/**
* えきすぱあとから終電発車時刻を取得
* @param {array} args
* 0: 検索したターミナル
* 1: 直前のターミナル
* 2: 検索駅
*/
function getCost(args){

  ////////
  // console.log("((getCost works))");
  ///////

  // console.log("args", args);

  const stations = []
  args.forEach(elm => {
    if(!stations.includes(elm)) stations.push(elm);
  });

  const params = `&searchType=lastTrain&viaList=${namelist(stations)}`;
  const type = "/search/course/extreme";
  const url = buildEkiUrl(type, params);

  ////
  // console.log("getcost の namelist", namelist(stations));
  /////

  return fetch(url)
   .then(res => {
     const json = res.json();
     return json;
   })
   .then(json => {
     const line = json.ResultSet.Course[0].Route.Line;
     let cost = "";
     if(Array.isArray(line)){
       cost = line[0].DepartureState.Datetime.text;
     } else {
       cost = line.DepartureState.Datetime.text;
     }

     return cost;
   })
   .catch(err => {
     return err;
   });
}

/**
* @return {array} rails
*/
function getRails(){

  /////////
  // console.log("((getRails works))");
  ///////

  const rails = [];

  // console.log("process in rail", processNode);

  processNode.edgesRail.forEach(elm => {

    ///////
    // console.log(`<<edgesRail: ${elm}>>`);
    ///////

    rails.push(elm);
  });

  if(processNode.cost === "start"){

    /////
    // console.log("rails", rails);
    ///////

    return rails;
  } else {
    if(!rails.includes(processNode.previousRail)){
      rails.push(processNode.previousRail);
    }
  }
  ////////
  // console.log("rails", rails);
  //////

  return rails;
}

function isTransfer(num, rail){

  let result;

  if(ekidata[rail][num]["odpt:connectingRailway"] != null){
    result = "terminal";
  }
  else result = "normal";

  return result;
}

/**
* @param {string} home
* @param {string} formed
* @param {string} name
* @param {array} rails
*/
function setEdges(home, formed, name, rails){

  //////////
  // console.log("((setEdges works))");
  //////////

  const rail = ekidata[rails];

  for(let i=0; i<rail.length; i++){

    /* ここら辺あとで怪しくなる気がする */
    if(rail[i]["dc:title"] === name){

      const edge = nodes[home][formed].edgesRail;
      const connect = rail[i]["odpt:connectingRailway"];

      // テスト
      // console.log("路線がない?", rail[i]);
      // if(connect === undefined || connect === null) console.log("connect dame", rail[i]);
      //////

      for(let j=0; j<connect.length; j++){
        if(!edge.includes(connect[j])){
          edge.push(connect[j]);
        }
      }
      break;
    }
  }
}

// 特定路線名からその路線上の全駅を取得しターミナルを特定
/**
* @param {string} railway - 路線を表すコード
*/
function searchTerminal(railway){

  ////////
  // console.log("((searchTerminal works))");
  ///////

  //// 修正
  // console.log("路線の確認 in searchTerminal", railway, `${processNode.name}について`);
  //////////

  const name = processNode.name;
  const rails_only_jp = [];
  let processNode_num = 0;
  let now_num;
  let terminal = [];
  let splitname = splitFormedName(name);

  ///////修正？
  if(ekidata[railway] === undefined || ekidata[railway].length === 0) return null;

  // 全駅日本語名の配列
  for(let i=0; i<ekidata[railway].length; i++){
    let jp_name = ekidata[railway][i]["dc:title"];
    // jp_name = checkDiffName(jp_name, railway); // ekidataの中の名前がprocessNodeと一致するのか
    rails_only_jp.push(jp_name);
  }

  // 路線上のプロセスノードの位置を特定
  for(let i=0; i<rails_only_jp.length; i++){
    processNode_num = i;
    if(rails_only_jp[processNode_num] == name) break;
    if(splitname.includes(rails_only_jp[processNode_num])) break;
  }

  // 上下線にそれぞれ進んでターミナルを特定
  now_num = processNode_num;
  while(now_num >= 0){
    if(now_num == 0){
      terminal.push(rails_only_jp[0]);
      break;
    }

    now_num--;

    let result = isTransfer(now_num, railway);
    if(result == "terminal"){
      terminal.push(rails_only_jp[now_num]);
      break;
    }
  }
  now_num = processNode_num;
  while(now_num <= rails_only_jp.length-1){
    if(now_num==rails_only_jp.length-1){
      terminal.push(rails_only_jp[now_num]);
      break;
    }

    now_num++;

    let result = isTransfer(now_num, railway)
    if(result == "terminal"){
      terminal.push(rails_only_jp[now_num]);
      break;
    }
  }

  return terminal;
}

/**
* @param {array} child
* 0: 現在検証中の分岐駅
* 1: 検索駅
* 2: 終電の発車時刻
*/
function setPriority(child){

  ///////
  // console.log("((setPriority works))");
  ///////

  if(priority.length < 1){
    priority.push(child);
  } else {
    const length = priority.length;
    for(let i=0; i<length; i++){
      // ダブりがないかどうかのテスト
      if(isEqualArray(child, priority[i])){
        // console.log(`<<priorityに既出のものがある: ${priority[i]}>>`);
        break;
      }
      //////////////
      if(child[2] == "start"){
        priority.unshift(child);
        break;
      }
      else if(typeof(child[2]) !== "string"){  // 応急処置 修正
        break;
      }
      else if(child[2] >= priority[i][2]){
        priority.splice(i, 0, child);
        break;
      }
      else if(i === length-1){
        priority.push(child);
        break;
      }
    }
  }
}

/**
* 同一行に重複があるかどうか
* @param {string} home - 最寄りの駅名
* @param {string} pre_terminal - 直前のターミナル駅
* @param {string} name - 検索駅
* @return {boolean} - falseなら重複無し、trueなら重複あり
*/
async function duplInSame(home, formed, origin, rail){

  ////////
  // console.log("((duplInSame works))");
  ////////

  // debugger;

  ////////
  if(typeof(formed)==="undefined") throw new Error("<<formedがundefined>>");
  //////

  let new_node = await createNode(home, formed, origin, rail);

  if(!nodes[home].hasOwnProperty(formed)){ // 重複無し
    nodes[home][formed] = new_node;
    return false;
  } else { // 重複あり
    let comparison = nodes[home][formed];

    if(new_node.cost > comparison){
      /// テスト用
      // console.log("<<重複ノード変更前", nodes[home][formed], ">>");
      //////////

      delete nodes[home][formed];
      nodes[home][formed] = new_node;

      // テスト用
      // console.log("<<重複ノード変更後", nodes[hoem][formed], ">>");
      //////////

      return false; // priorityの操作を行う
    } else {
      delete new_node;
    }

    return true;
  }
}

/**
* 異なる行に重複はあるか
* @param {string} home
* @param {string} formed
* @return {boolen} - 重複があればtrue、なければfalse
*/
function duplInDiff(home, formed){

  //////
  // console.log("((duplInDiff works))");
  //////

  for(let key in nodes){
    if(key !== home){ // 検索中の行は無視
      for(let station in nodes[key]){ // ここで異なる行の駅名と比べる
        if(station.name === formed){ // 重複する場合はループを抜ける

          // テスト用
          // console.log("<<異なる行の重複がある>>", nodes[home][formed], nodes[key][station]);
          /////////////

          return true;
        }
      }
    }
  }
  return false;
}

async function findNewNode(){

  /////////////
  // console.log("((findNewNode works))", processNode);
  ////////////

  const name = processNode.name;
  // 検索駅がどこのなのか判断する
  let home = processNode;
  if(home.cost === "start") home = home.name;
  else {
    while(home.previousNode !== null){
      home = home.previousNode;
    }
    home = home.name;
  }
  const split_name = splitFormedName(name);

  let split_previous;
  if(processNode.previousNode !== null){
    split_previous = splitFormedName(processNode.previousNode.name);
  }

  ///////////
  // homeが検索駅のいずれかに当てはまるか確かめるテスト
  // console.log("homeの中身",home);
  if(!Object.keys(nodes).includes(home))
    throw new Error(`<<homeが検索駅のいずれにも当てはまらない: ${home}>>`);
  ///////

  const rails = getRails();

  // テスト
  try {
    if(rails.length < 1){
      const e = new Error();
      e.message = "不正な駅名が含まれています";
      input_error = true;
      throw e.message;
    }
  } catch(e) {
    const message = `${e}<br><br>ヒント<br>対応してない駅名が含まれている<br>対応してない路線が含まれいる`;
    $.when(
      removeLoading()
    ).done(function (){
      displayResult(message);
    });
  }
  if(input_error) throw new Error("<<railsの中身が空>>");
  //////////

  for(let i=0; i<rails.length; i++){
    const terminals = searchTerminal(rails[i]);

    // 修正?
    // if(terminals[0] === undefined) continue;
    if(terminals === null) continue;

    // terminalsを正しく取得できてるかテスト
    // if(terminals.length < 1) throw new Error("<<terminalが不正>>", terminals);
    // console.log("terminalsの中身", terminals);
    /////////////////


    for(let j=0; j<terminals.length; j++){

      // 直前のターミナル駅は入れちゃダメ
      if(processNode.previousNode === null){ // スタートノードの時
        if(split_name.includes(terminals[j])){
          continue;
        }
      } else { // スタート以降は直前のターミナルに気を付ける
        if(split_name.includes(terminals[j]) || split_previous.includes(terminals[j])){
          continue;
        }
      }

      let origin_name = terminals[j];
      let formed_name = formDiffTransfer(terminals[j]);

      // 検索駅と名前が一致する場合はやる意味がない
      // if(formed_name === nodes[home][home].name) continue;

      let done = false; // doneCountについて操作するかどうか

      done = await duplInSame(home, formed_name, origin_name, rails[i]);
      if(done === true) continue; // 同列行で重複した時は事故る
      duplInDiff(home, formed_name);

      /////
      const new_node = nodes[home][formed_name];
      // console.log(new_node.name, ":", rails[i]);
      ////

      /////////
      // console.log("路線", formed_name, rails[i]);
      ////////

      // previousRailに追加
      if(nodes[home][formed_name].previousRail === null){
        nodes[home][formed_name].previousRail = rails[i];

        // diff_ekinameがあればset
        let check_name = checkDiffName(origin_name, nodes[home][formed_name].previousRail);
        nodes[home][formed_name].ekispert = check_name;
      }

      // 駅名を分解して、全てのconnectingRailwayを調べる
      const stations = splitFormedName(formed_name);

      stations.forEach(async elm => {
        if(elm === origin_name){
          setEdges(home, formed_name, elm, rails[i]);
        }
      });

      // edgesRailがあるかのテスト
      // if(new_node.edgesRail.length < 1) throw new Error(`<<edgesRailの中身がない: ${formed_name}>>`);
      /////////////////////

      const priority_child = [formed_name, home, new_node.cost];

      // priorityの中に被りがあるかどうか（本来はあっちゃダメ）
      let bool_priority = priority.some(elm => {
        if(isEqualArray(elm, priority_child)){ // 一つでも被りがあるばあい

          //// priorityの重複を確かめるテスト
          // console.log("<<priority内の要素にchildに一致するのもがある: ", priority_child);
          ///////////////
          return true;
        } else {
          return false;
        }
      });

      if(!bool_priority) setPriority(priority_child);
    }
  }

  // doneCountについての操作
  if(processNode.done === false) {
    processNode.done = true;
    if(doneCount.hasOwnProperty(name)) doneCount[name]++;
    else doneCount[name] = 1;
  }

  // 仮最適駅に関する操作
  if(doneCount[name] === homeNum) temp_optimum.push(name);
}

async function findTempOptimum(){
  // console.log("((findTempOptimum works))");
  await setStartNode(eki_names);

  ///////////
  // あとで消す
  // console.log(nodes);
  ///////////

  setProcessNode();

  // 仮最適を探すループ
  // while(temp_optimum.length < 1 || isTimeSame === true){
  let loop_count = 1;
  while(temp_optimum.length < 1 || isTimeSame === true){
    ///////////
    // console.log(`<<now processNode: ${processNode}`);
    ////////

    ////////
    console.log(`loop ${loop_count}周目`);
    ////////

    ////////////
    // 正常にprocessNodeが切り替わってるかどうかのテスト
    if(prev_process === processNode) throw new Error("<<processNodeが正常に切り替わってない>>");
    /////////////

    await findNewNode();


    //// 開発よう(テスト)
    // if(temp_optimum.length > 0 && isTimeSame === false) break;
    /////////


    //////////
    // 適性な数のpriorityの要素が存在するか確かめるテスト
    if(priority.length < 2) throw new Error(`<<priorityの要素が足りない(${loop_count}周目)>>`);
    //////////

    prev_process = processNode;
    setProcessNode();

    loop_count++; /* あとで消す */
    // console.log("processNode.name", processNode.name);
  }


  // console.log("仮最適駅", temp_optimum);
}

/**
* 最初に入力された配列が不正じゃないかどうか
* @param {array} eki_names
* @return (object) error
*/
function checkHomeStations(eki_names){
  const e = new Error();
  while(eki_names.includes("")){
    eki_names.splice(eki_names.indexOf(""), 1);
  }
  if(eki_names.length < 2){
    e.message = "2つ以上の駅名を入力してください";
    input_error = true;
  }

  return e;
}

async function main(){
  console.log("((program works))");

  // 修正
  const start_time = performance.now();
  /////

  eki_names = getKensakuEkiArray();

  // eki_namesが不正な場合の処理
  const error = checkHomeStations(eki_names);

  if(!input_error){ // 入力の時点が不正でなければ検索を実行
    $.when(
      $('#main').fadeOut()
    ).done(function (){
      showLoading();
    });

    // 路線毎の駅情報を取得し代入する
    ekidata = await getEkiData();


    await findTempOptimum(eki_names);

    // 修正
    const end_time = performance.now();
    console.log("実行時間", `${((end_time - start_time)/1000)}秒`);
    ////

    /////////
    console.log("find　抜けたよ");
    /////////

    optimum_station = await findOptimum(temp_optimum);
    console.log("最適駅：", optimum_station);

    $.when(
      removeLoading()
    ).done(function (){
      displayResult();
    });
  } else {
    $.when(
      $('#main').fadeOut()
    ).done(function (){
      displayResult(error.message);
    });
  }

  // 修正
  const opt_time = performance.now();
  const real_time = (opt_time - start_time) / 1000;
  /////

  // displayResult(); // 検索結果を表示する

  // 修正
  console.log(`最初から最後までの実行時間: ${real_time}秒`);
  ///////
}
