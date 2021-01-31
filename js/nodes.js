/**
* ノードに関するモデル
*/
function Node(name){
  this.name = name;
  this.ekispert = null;
  this.multi = false;
  this.origin = null;
  this.cost = "";
  this.edgesRail = [];
  this.previousRail = null;
  this.previousNode = null;
  this.done = false;
}


/**
* 検索駅がどの路線上にあるのかを取得する
* @param {string} home
* @param {array} name - 0: 駅名, (1: 整形後の名前)
* @return {array} rails - 駅に接続する路線名の配列
*/
function getEdgesRails(home, name){

  ///////
  // console.log("((getEdgesRails works))");
  ///////

  const type = "odpt:Station";
  const params = `&dc:title=${name[0]}`;
  const url = buildOpenUrl(type, params);
  const rails = [];
  let node = null;

  // startとそうでないので違う
  // if(name.length === 1){
  //   node = nodes[home][name[0]];
  // } else {
    node = nodes[home][name[1]];
  // }

  // if(node.cost === "start"){
    return fetch(url)
    .then(res => {
      const json = res.json()
      return json;
    })
    .then(json => {
      for(let i=0; i<json.length; i++){
        rails.push(json[i]["odpt:railway"]);
      }
      return rails;
    });
}

function setProcessNode(){

  //////////
  // console.log("((setProcessNode works))");
  ////////

  // priorityが空になってないかのテスト
  if(priority.length < 1) throw new Error("<<priorityが空>>");
  ///////////

  // priority/processの変化のテストよう
  const origin_num = priority.length;
  const origin_process = processNode;
  // console.log("priority確認", priority);
  // alert(`${priority[0][0]}:${priority[0][1]}, ${priority[1][0]}:${priority[1][1]}`);
  // console.log("変化前process", processNode);
  /////////

  if(priority[0][2] === priority[1][2]) isTimeSame = true;
  else isTimeSame = false;

  let now = priority[0][0]; // ターミナル
  let home = priority[0][1]; // 検索駅

  ///// 修正
  // console.log("なんで？", nodes[home][now]);
  /////////

  // processNodeの名前は正しいのかテスト
  if(!nodes[home].hasOwnProperty(now)){
    throw new Error(`こんなnodeはねー, ${home}:${now}`);
  }
  ///////////////

  processNode = nodes[home][now];

  priority.shift(); // 先頭を消す

  //// テスト
  const test_process = processNode;
  // console.log(test_process);
  ////////

  // priority/processが変化したかのテスト
  const changed_num = priority.length;
  const changed_process = processNode;
  if(changed_num === origin_num) throw new Error("<<priorityが変化してない>>");
  // if(changed_process === origin_process){
  //   console.log("変わらないprocessNode", processNode);
  //   throw new Error("<<processNodeが変化してない>>");
  // }
  /////////////
}

// 検索駅のnodeを設定
async function setStartNode(eki_names = null){

  /////////////
  // console.log("((set start node))");
  /////////////

  // eki_names が渡されてるかどうかのテスト
  // if(eki_names === null) console.log("eki_names is null");
  //////

  const starts = eki_names;
  homeNum = starts.length;

  for(let i=0; i<starts.length; i++){
    let name = starts[i];
    const formed = formDiffTransfer(name);
    nodes[formed] = {};
    const n_start = nodes[formed]; // 検索駅の行を示す
    n_start[formed] = new Node(formed);
    const node = n_start[formed];
    node.cost = "start";

    if(formed.includes("/")) node.multi = true;
    node.origin = name;

    const rails = node.edgesRail;
    const stations = splitFormedName(formed);

    for(let j=0; j<stations.length; j++){
      const arr = await getEdgesRails(formed, [stations[j], formed]);

      arr.forEach(rail => {
        if(!rails.includes(rail)) node.edgesRail.push(rail);
      });
    }

    // console.log("((start node))", node);

    // console.log("edges in setstart", node.edgesRail);

    // diff_ekinameがある場合はセット
    let ekispert_name = node.origin;

    for(let i in node.edgesRail){
      ekispert_name = checkDiffName(ekispert_name, node.edgesRail[i]);
    }

    node.ekispert = ekispert_name;
  }

  // start node をpriorityにセットする
  for(let i=0; i<starts.length; i++){
    const formed = formDiffTransfer(starts[i]);
    const priority_child = [formed, formed, nodes[formed][formed].cost];

    ////////////////////
    // priority_childが正しいかどうかのテスト
    // console.log(priority_child);
    const isString = item => typeof(item) === "string";
    if(!priority_child.every(isString) || !priority_child.length === 3){
      // console.log("<<prirority_childが正しくない>>", priority_child);
    }
    ///////////////

    setPriority(priority_child);
  }
}

/**
* @param {string} home - 検索駅の名前
* @param {string} formed - 登録用の整形された名前
* @param {string} origin
* @param {string} rail
* @return {Node} new_node
*/
async function createNode(home, formed, origin, rail){ // ←orignいらない？

  /////////
  // console.log("((createNode works))");
  ////////

  const new_node = new Node(formed);
  new_node.previousNode = processNode;

  /////
  // console.log(home);
  /////

  if(formed.includes("/")){ // 異名乗り換え駅の場合
    new_node.multi = true;
    new_node.origin = origin;
  }

  const tmp_cost = [];
  // const stations = splitFormedName(formed);
  const home_node = nodes[home][home];
  // console.log("stations in createNode ", stations);

  // for(let i=0; i<stations.length; i++){
  //
  //   const station_name = checkDiffName(stations[i], rail)
  //
  //   tmp_cost[i] = await getCost([station_name, processNode.ekispert, home_node.ekispert]);
  // }

  // getCostの呼び出し部分
  const station_name = checkDiffName(origin, rail);
  tmp_cost.push(await getCost([station_name, home_node.ekispert]));


  /// テスト
  if(tmp_cost.length < 1) {
    throw new Error(`<<コストを正しく取得できてない: ${formed}>>`);
  }
  ////////////

  const cost = minCost(tmp_cost);
  new_node.cost = cost;

  return new_node;
}
