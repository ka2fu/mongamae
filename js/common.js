// グローバル関数の宣言
const temp_optimum = [];
const nodes = {};
const doneCount = {};
let eki_names = [];
let priority = [];
let ekidata;
let homeNum = 0;
let isTimeSame = true;
let processNode = null;
let optimum_station;
let input_error = false;


// テスト用
let prev_process = null;
//

//公共交通APIと駅すぱあとAPiで異なる駅名の配列
const diff_ekiname = {
  '青海':{'odpt.Railway:Yurikamome.Yurikamome':'青海(東京都)'},
  '赤坂':{'odpt.Railway:TokyoMetro.Chiyoda':'赤坂(東京都)'},
  '愛宕':{'odpt.Railway:Tobu.TobuUrbanPark':'愛宕(千葉県)'},
  '我孫子':{'odpt.Railway:JR-East.JobanLocal':'我孫子(千葉県)','odpt.Railway:JR-East.JobanRapid':'我孫子(千葉県)','odpt.Railway:JR-East.NaritaAbikoBranch':'我孫子(千葉県)'},
  '有明':{'odpt.Railway:Yurikamome.Yurikamome':'有明(東京都)'},
  '稲荷町':{'odpt.Railway:TokyoMetro.Ginza':'稲荷町(東京都)'},
  '入谷':{'odpt.Railway:JR-East.Sagami':'入谷(神奈川県)','odpt.Railway:TokyoMetro.Hibiya':'入谷(東京都)',},
  '浦安':{'odpt.Railway:TokyoMetro.Tozai':'浦安(千葉県)'},
  '扇町':{'odpt.Railway:JR-East.Tsurumi':'扇町(神奈川県)'},
  '大久保':{'odpt.Railway:JR-East.ChuoSobuLocal':'大久保(東京都)'},
  '大倉山':{'odpt.Railway:Tokyu.Toyoko':'大倉山(神奈川県)'},
  '太田':{'odpt.Railway:Tobu.Isesaki':'太田(群馬県)','odpt.Railway:Tobu.Kiryu':'太田(群馬県)','odpt.Railway:Tobu.KoizumiBranch':'太田(群馬県)'},
  '大塚':{'odpt.Railway:JR-East.Yamanote':'大塚(東京都)'},
  '大手町':{'odpt.Railway:Toei.Mita':'大手町(東京都)','odpt.Railway:TokyoMetro.Chiyoda':'大手町(東京都)','odpt.Railway:TokyoMetro.Hanzomon':'大手町(東京都)','odpt.Railway:TokyoMetro.Marunouchi':'大手町(東京都)','odpt.Railway:TokyoMetro.Tozai':'大手町(東京都)'},
  '大原':{'odpt.Railway:JR-East.Sotobo':'大原(千葉県)'},
  '大宮':{'odpt.Railway:Tobu.TobuUrbanPark':'大宮(埼玉県)',
  'odpt.Railway:JR-East.AkitaShinkansen':'大宮(埼玉県)',
  'odpt.Railway:JR-East.HokurikuShinkansen':'大宮(埼玉県)',
  'odpt.Railway:JR-East.JoetsuShinkansen':'大宮(埼玉県)',
  'odpt.Railway:JR-East.KeihinTohokuNegishi':'大宮(埼玉県)',
  'odpt.Railway:JR-East.SaikyoKawagoe':'大宮(埼玉県)',
  'odpt.Railway:JR-East.ShonanShinjuku':'大宮(埼玉県)',
  'odpt.Railway:JR-East.Takasaki':'大宮(埼玉県)',
  'odpt.Railway:JR-East.TohokuShinkansen':'大宮(埼玉県)',
  'odpt.Railway:JR-East.Utsunomiya':'大宮(埼玉県)',
  'odpt.Railway:JR-East.YamagataShinkansen':'大宮(埼玉県)'
  },
  '大山':{'odpt.Railway:Tobu.Tojo':'大山(東京都)'},
  '大和田':{'odpt.Railway:Tobu.TobuUrbanPark':'大和田(埼玉県)'},
  '岡本':{'odpt.Railway:JR-East.Utsunomiya':'岡本(栃木県)'},
  '小川町':{'odpt.Railway:Toei.Shinjuku':'小川町(東京都)','odpt.Railway:Tobu.Tojo':'小川町(埼玉県)','odpt.Railway:JR-East.Hachiko':'小川町(埼玉県)'},
  '春日':{'odpt.Railway:Toei.Mita':'春日(東京都)','odpt.Railway:Toei.Oedo':'春日(東京都)',},
  '霞ケ関':{'odpt.Railway:TokyoMetro.Chiyoda':'霞ケ関(東京都)','odpt.Railway:TokyoMetro.Marunouchi':'霞ケ関(東京都)','odpt.Railway:TokyoMetro.Hibiya':'霞ケ関(東京都)'},
  '霞ヶ関':{'odpt.Railway:Tobu.Tojo':'霞ケ関(埼玉県)'},
  '神田':{'odpt.Railway:JR-East.ChuoRapid':'神田(東京都)',
  'odpt.Railway:JR-East.KeihinTohokuNegishi':'神田(東京都)',
  'odpt.Railway:JR-East.Yamanote':'神田(東京都)',
  'odpt.Railway:TokyoMetro.Ginza':'神田(東京都)'},
  '京橋':{'odpt.Railway:TokyoMetro.Ginza':'京橋(東京都)'},
  '郡山':{'odpt.Railway:JR-East.Tohoku':'郡山(福島県)'},
  '小林':{'odpt.Railway:JR-East.NaritaAbikoBranch':'小林(千葉県)'},
  '栄町':{'odpt.Railway:Toei.Arakawa':'栄町(東京都)'},
  '桜台':{'odpt.Railway:Seibu.Ikebukuro':'桜台(東京都)'},
  '三郷':{'odpt.Railway:JR-East.Musashino':'三郷(埼玉県)'},
  '十条':{'odpt.Railway:JR-East.SaikyoKawagoe':'十条(東京都)'},
  '新田':{'odpt.Railway:Tobu.TobuSkytree':'新田(埼玉県)'},
  '森林公園':{'odpt.Railway:Tobu.Tojo':'森林公園(埼玉県)'},
  '杉田':{'odpt.Railway:Keikyu.Main':'杉田(神奈川県)'},
  '住吉':{'odpt.Railway:Toei.Shinjuku':'住吉(東京都)','odpt.Railway:TokyoMetro.Hanzomon':'住吉(東京都)',},
  '大門':{'odpt.Railway:Toei.Asakusa':'大門(東京都)','odpt.Railway:Toei.Oedo':'大門(東京都)',},
  '高田':{'odpt.Railway:YokohamaMunicipal.Green':'高田(神奈川県)'},
  '高尾':{'odpt.Railway:Keio.Takao':'高尾(東京都)','odpt.Railway:JR-East.Chuo':'高尾(東京都)','odpt.Railway:JR-East.ChuoRapid':'高尾(東京都)'},
  '高津':{'odpt.Railway:Tokyu.DenEnToshi':'高津(神奈川県)','odpt.Railway:Tokyu.Oimachi':'高津(神奈川県)',},
  '多田':{'odpt.Railway:Tobu.Sano':'多田(栃木県)'},
  '戸田':{'odpt.Railway:JR-East.SaikyoKawagoe':'戸田(埼玉県)'},
  '富田':{'odpt.Railway:JR-East.Ryomo':'富田(栃木県)'},
  '中川':{'odpt.Railway:YokohamaMunicipal.Blue':'中川(神奈川県)'},
  '中田':{'odpt.Railway:YokohamaMunicipal.Blue':'中田(神奈川県)'},
  '長沼':{'odpt.Railway:Keio.Keio':'長沼(東京都)'},
  '中野':{'odpt.Railway:JR-East.ChuoRapid':'中野(東京都)','odpt.Railway:JR-East.ChuoSobuLocal':'中野(東京都)','odpt.Railway:TokyoMetro.Tozai':'中野(東京都)'},
  '長原':{'odpt.Railway:Tokyu.Ikegami':'長原(東京都)'},
  '中山':{'odpt.Railway:YokohamaMunicipal.Green':'中山(神奈川県)','odpt.Railway:JR-East.Yokohama':'中山(神奈川県)',},
  '成島':{'odpt.Railway:Tobu.Koizumi':'成島(群馬県)'},
  '日進':{'odpt.Railway:JR-East.SaikyoKawagoe':'日進(埼玉県)'},
  '日本橋':{'odpt.Railway:Toei.Asakusa':'日本橋(東京都)','odpt.Railway:TokyoMetro.Ginza':'日本橋(東京都)','odpt.Railway:TokyoMetro.Tozai':'日本橋(東京都)'},
  '野崎':{'odpt.Railway:JR-East.Utsunomiya':'野崎(栃木県)'},
  '白山':{'odpt.Railway:Toei.Mita':'白山(東京都)'},
  '橋本':{'odpt.Railway:Keio.Sagamihara':'橋本(神奈川県)','odpt.Railway:JR-East.Sagami':'橋本(神奈川県)','odpt.Railway:JR-East.Yokohama':'橋本(神奈川県)'},
  '八丁堀':{'odpt.Railway:JR-East.Keiyo':'八丁堀(東京都)','odpt.Railway:TokyoMetro.Hibiya':'八丁堀(東京都)',},
  '番田':{'odpt.Railway:JR-East.Sagami':'番田(神奈川県)'},
  '日野':{'odpt.Railway:JR-East.ChuoRapid':'日野(東京都)'},
  '日吉':{'odpt.Railway:YokohamaMunicipal.Green':'日吉(神奈川県)','odpt.Railway:Tokyu.Meguro':'日吉(神奈川県)','odpt.Railway:Tokyu.Toyoko':'日吉(神奈川県)'},
  '藤が丘':{'odpt.Railway:Tokyu.DenEnToshi':'藤が丘(神奈川県)'},
  '府中':{'odpt.Railway:Keio.Keio':'府中(東京都)'},
  '星川':{'odpt.Railway:Sotetsu.Main':'星川(神奈川県)'},
  '松尾':{'odpt.Railway:JR-East.Sobu':'松尾(千葉県)'},
  '三田':{'odpt.Railway:Toei.Asakusa':'三田(東京都)','odpt.Railway:Toei.Mita':'三田(東京都)',},
  '森下':{'odpt.Railway:Toei.Oedo':'森下(東京都)','odpt.Railway:Toei.Shinjuku':'森下(東京都)',},
  '梁川':{'odpt.Railway:JR-East.Chuo':'梁川(山梨県)'},
  '山下':{'odpt.Railway:Tokyu.Setagaya':'山下(東京都)','odpt.Railway:JR-East.Joban':'山下(宮城県)',},
  '山田':{'odpt.Railway:Keio.Takao':'山田(東京都)'},
  '大和':{'odpt.Railway:Odakyu.Enoshima':'大和(神奈川県)','odpt.Railway:Sotetsu.Main':'大和(神奈川県)',},
  '早稲田':{'odpt.Railway:Toei.Arakawa':'早稲田(都電荒川線)','odpt.Railway:TokyoMetro.Tozai':'早稲田(東京メトロ)',},
  '弘明寺':{'odpt.Railway:YokohamaMunicipal.Blue':'弘明寺(横浜市営)','odpt.Railway:Keikyu.Main':'弘明寺(京急線)',},
  '明治神宮前〈原宿〉':{'odpt.Railway:TokyoMetro.Chiyoda':'明治神宮前','odpt.Railway:TokyoMetro.Fukutoshin':'明治神宮前'},
  '押上(スカイツリー前)':{'odpt.Railway:Tobu.TobuSkytreeBranch':'押上','odpt.Railway:Keisei.Oshiage':'押上'},
  '押上〈スカイツリー前〉':{'odpt.Railway:TokyoMetro.Hanzomon':'押上'},
  '二重橋前〈丸の内〉':{'odpt.Railway:TokyoMetro.Chiyoda':'二重橋前'},
  '笹塚':{'odpt.Railway:Keio.Keio':'笹塚','odpt.Railway:Keio.KeioNew':'笹塚'},
  '北野':{'odpt.Railway:Keio.Takao':'北野(東京都)','odpt.Railway:Keio.Keio':'北野(東京都)'},
  '本八幡':{'odpt.Railway:JR-East.ChuoSobuLocal':'本八幡(総武線)','odpt.Railway:Toei.Shinjuku':'本八幡(都営線)'},
  '豊島園':{'odpt.Railway:Seibu.Toshima':'豊島園(西武線)','odpt.Railway:Toei.Oedo':'豊島園(都営線)'},
  '町屋':{'odpt.Railway:TokyoMetro.Chiyoda':'町屋(東京メトロ)','odpt.Railway:Keisei.Main':'町屋(京成線)'},
  '大森':{'odpt.Railway:JR-East.KeihinTohokuNegishi':'大森(東京都)'},
  '梅屋敷':{'odpt.Railway:Keikyu.Main':'梅屋敷(東京都)'},
  '海老名':{'odpt.Railway:Odakyu.Odawara':'海老名(相鉄・小田急)','odpt.Railway:Sotetsu.Main':'海老名(相鉄・小田急)','odpt.Railway:JR-East.Sagami':'海老名(相模線)'},
  '田町':{'odpt.Railway:JR-East.KeihinTohokuNegishi':'田町(東京都)','odpt.Railway:JR-East.Yamanote':'田町(東京都)'},
  '市ヶ谷':{'odpt.Railway:Toei.Shinjuku':'市ケ谷'}
};

/**
* 異名乗り換えのリスト
*/
const diff_transfer = {
  "武蔵溝ノ口" : "溝の口/武蔵溝ノ口",
  "溝の口" : "溝の口/武蔵溝ノ口",
  "京急東神奈川" : "京急東神奈川/東神奈川",
  "東神奈川" : "京急東神奈川/東神奈川",
  "白糸台" : "武蔵野台/白糸台",
  "武蔵野台" : "武蔵野台/白糸台",
  "北朝霞" : "朝霞台/北朝霞",
  "朝霞台" : "朝霞台/北朝霞",
  "秋津" : "新秋津/秋津",
  "新秋津" : "新秋津/秋津",
  "王子駅前" : "王子駅前/王子",
  "王子" : "王子駅前/王子",
  "町屋駅前" : "町屋駅前/町屋",
  "町屋" : "町屋駅前/町屋",
  "大塚駅前" : "大塚駅前/大塚",
  "大塚" : "大塚駅前/大塚",
  "東池袋" : "東池袋/東池袋四丁目",
  "東池袋四丁目" : "東池袋/東池袋四丁目",
  "雑司が谷" : "雑司が谷/鬼子母神前",
  "鬼子母神前" : "雑司が谷/鬼子母神前",
  "稲田堤" : "稲田堤/京王稲田堤",
  "京王稲田堤" : "稲田堤/京王稲田堤",
  "山下" : "山下/豪徳寺",
  "豪徳寺" : "山下/豪徳寺",
  "原宿" : "原宿/明治神宮前〈原宿〉",
  "明治神宮前〈原宿〉" : "原宿/明治神宮前〈原宿〉",
  "羽田空港第１ターミナル" : "羽田空港第１・２ターミナル/羽田空港第１ターミナル",
  "羽田空港第１・２ターミナル" : "羽田空港第１ターミナル/羽田空港第１・２ターミナル",
  "羽田空港第２ターミナル" : "羽田空港第１・２ターミナル/羽田空港第２ターミナル",
  "羽田空港第１・２ターミナル" : "羽田空港第２ターミナル/羽田空港第１・２ターミナル",
  "新宿西口" : "新宿西口/新宿/西武新宿",
  "新宿" : "新宿西口/新宿/西武新宿",
  "西武新宿" : "新宿西口/新宿/西武新宿",
  "国際展示場" : "国際展示場/有明",
  "有明" : "国際展示場/有明",
  "金町" : "金町/京成金町",
  "京成金町" : "金町/京成金町",
  "新松戸" : "新松戸/幸谷",
  "幸谷" : "新松戸/幸谷",
  "牛田" : "牛田/京成関屋",
  "京成関屋" : "牛田/京成関屋",
  "八柱" : "八柱/新八柱",
  "新八柱" : "八柱/新八柱",
  "本八幡" : "本八幡/京成八幡",
  "京成八幡" : "本八幡/京成八幡",
  "西船橋" : "西船橋/京成西船",
  "京成西船" : "西船橋/京成西船",
  "津田沼" : "津田沼/新津田沼",
  "新津田沼" : "津田沼/新津田沼",
  "幕張本郷" : "幕張本郷/京成幕張本郷",
  "京成幕張本郷" : "幕張本郷/京成幕張本郷",
  "京成千葉" : "京成千葉/千葉",
  "千葉" : "京成千葉/千葉",
  "立川" : "立川/立川南",
  "立川南" : "立川/立川南",
  "立川" : "立川/立川北",
  "立川北" : "立川/立川北",
  "江ノ島" : "江ノ島/片瀬江ノ島/湘南江の島",
  "片瀬江ノ島" : "江ノ島/片瀬江ノ島/湘南江の島",
  "湘南江の島" : "江ノ島/片瀬江ノ島/湘南江の島",
  "京王永山" : "京王永山/小田急永山",
  "小田急永山" : "京王永山/小田急永山",
  "京王多摩センター" : "京王多摩センター/小田急多摩センター",
  "小田急多摩センター" : "京王多摩センター/小田急多摩センター",
  "南越谷" : "南越谷/新越谷",
  "新越谷" : "南越谷/新越谷",
  "成田" : "成田/京成成田",
  "京成成田" : "成田/京成成田",
  "西武秩父" : "西武秩父/御花畑",
  "御花畑" : "西武秩父/御花畑",
  "三田" : "三田/田町",
  "田町" : "三田/田町",
  "大門" : "大門/浜松町",
  "浜松町" : "大門/浜松町",
  "新富町" : "新富町/築地",
  "築地" : "新富町/築地",
  "有楽町" : "有楽町/日比谷",
  "日比谷" : "有楽町/日比谷",
  "国会議事堂前" : "国会議事堂前/溜池山王",
  "溜池山王" : "国会議事堂前/溜池山王",
  "永田町" : "永田町/赤坂見附",
  "赤坂見附" : "永田町/赤坂見附",
  "新板橋" : "新板橋/板橋",
  "板橋" : "新板橋/板橋",
  "春日" : "春日/後楽園",
  "後楽園" : "春日/後楽園",
  "新御茶ノ水" : "新御茶ノ水/小川町/淡路町",
  "小川町" : "新御茶ノ水/小川町/淡路町",  //小川町は重複駅名あり、処理はどうしましょうか、、、？
  "淡路町" : "新御茶ノ水/小川町/淡路町",
  "新日本橋" : "新日本橋/三越前",
  "三越前" : "新日本橋/三越前",
  "人形町" : "人形町/水天宮前",
  "水天宮前" : "人形町/水天宮前",
  "馬喰町" : "馬喰町/馬喰横山/東日本橋",
  "馬喰横山" : "馬喰町/馬喰横山/東日本橋",
  "東日本橋" : "馬喰町/馬喰横山/東日本橋",
  "秋葉原" : "秋葉原/岩本町",
  "岩本町" : "秋葉原/岩本町",
  "上野広小路" : "上野広小路/上野御徒町/御徒町/仲御徒町",
  "上野御徒町" : "上野広小路/上野御徒町/御徒町/仲御徒町",
  "御徒町" : "上野広小路/上野御徒町/御徒町/仲御徒町",
  "仲御徒町" : "上野広小路/上野御徒町/御徒町/仲御徒町",
  "京成上野" : "京成上野/上野",
  "上野" : "京成上野/上野",
  "市川" : "市川/市川真間",
  "市川真間" : "市川/市川真間",
  "鶴見" : "鶴見/京急鶴見",
  "京急鶴見" : "鶴見/京急鶴見",
  "新子安" : "新子安/京急新子安",
  "京急新子安" : "新子安/京急新子安",
  "押上" : "押上/押上〈スカイツリー前〉/押上(スカイツリー前)",
  "押上〈スカイツリー前〉" : "押上/押上〈スカイツリー前〉/押上(スカイツリー前)",
  "押上(スカイツリー前)" : "押上/押上〈スカイツリー前〉/押上(スカイツリー前)",
  "京急川崎" : "京急川崎/川崎",
  "川崎" : "京急川崎/川崎",
  "虎ノ門ヒルズ" : "虎ノ門ヒルズ/虎ノ門",
  "虎ノ門" : "虎ノ門ヒルズ/虎ノ門",
  "松田" : "松田/新松田",
  "新松田" : "松田/新松田",
  "西巣鴨" : "西巣鴨/新庚申塚",
  "新庚申塚" : "西巣鴨/新庚申塚",
  "銀座" : "銀座/銀座一丁目",
  "銀座一丁目" : "銀座/銀座一丁目",
  "市ヶ谷" :"市ヶ谷/市ケ谷",
  "市ケ谷" :"市ヶ谷/市ケ谷"
  };

/**
* apiを叩く時に使うurlを生成(for ekispert)
* @param {string} type - 使用するapiの種類を示す
* @param {string} params - urlに必要なパラメーター
* @return {string} url
*/
function buildEkiUrl(type, params){
  let url = `http://api.ekispert.jp/v1/json${type}?key=test_BZCUDqKwawx${params}`;
  // console.log(url);
  return url;
}

/**
* apiを叩く時に使うurlを生成(for open challenge)
* @param {string} type - 使用するapiの種類を示す
* @param {string} params - urlに必要なパラメーター
* @return {string} url
*/
// ↓名前を変更
function buildOpenUrl(type, params){
  const url = `https://api-tokyochallenge.odpt.org/api/v4/${type}?acl:consumerKey=RNN8c5hZf4Pa0HxqR6mszHzOBTdxIsD17RKFoxuDQik${params}`;
  // console.log(url);
  return url;
}

/**
* 駅名の配列をurlに適した文字列にする
* @param {array} names
* @return {string} str
*/
function namelist(names){
  var str = "";
  for(var i=0; i<names.length; i++){
    if(i == names.length - 1){
      str += names[i];
    } else {
      str += names[i] + ":";
    }
  }
  // console.log(str);
  return str;
}

function isEqualArray(a, b){
  if(!Array.isArray(a)) return false;
  if(!Array.isArray(b)) return false;
  if(a.length !== b.length) return false;
  for(let i=0; i<a.length; i++){
    if(a[i] !== b[i]) return false;
  }
  return true;
}

/**
* openApi → ekispertApi
*/
function checkDiffName(name, rail){
  ///////　修正
  // console.log("<<checkDiffName works>>");
  /////////


  if(diff_ekiname.hasOwnProperty(name)){

    //テスト用
    const origin_name = name;
    ////////////////

    name = diff_ekiname[name][rail];

    //////テスト
    // console.log("<<changed difference name", origin_name, "to", name + ">>");
    ///////////////////
  }
  return name;
}

/**
* 異名乗り換え駅の駅名をいい感じにする
* @param {string} name - 探索で出てきたターミナル駅の名前
* @return {string} formed
*/
function formDiffTransfer(name){
  let formed = name;
  if(diff_transfer.hasOwnProperty(formed)){
      formed = diff_transfer[formed];

      ////テスト用
      // console.log("<<ノードに登録する駅名が整形された", formed, ">>");
      ////////////
    }

  return formed;
}

/**
* @param {string} name - ノードの名前
* @return {array} stations
*/
function splitFormedName(name){
  const stations = name.split("/");
  return stations;
}
