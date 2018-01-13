//geolocationでそれっぽくする
var useGeo=true;//位置情報を使うかどうか
	var threshold=0.00001;//当たり判定の閾値
//音を出さないとデバッグできないんじゃ、でも実際は使ってない
var snd_cancel=new Audio("cancel.mp3");//位置情報が範囲外に出た音
var snd_find=new Audio("find.mp3");//どこかの地点に重なった音
var snd_begin=new Audio("begin.mp3");//スタートアップサウンド

var xhr= new XMLHttpRequest();//動的にサーバ側と通信したい
var lat=0.0, lng=0.0;//緯度・傾度をとる

var connections=[];//ブラインドの位置情報
var blind_id;//自分がブラインドの時にサーバーから発行されるID

var server_addr="server.php"//サーバースクリプトへの相対パス、絶対パスにするとだめ
//カメラ写すあれの設定
//const medias = {audio : false, video : true},
//リアカメラ用

const medias = {audio : false, video : {
    facingMode : {
      exact : "environment"
    }
  }},

      video  = document.getElementById("video");
navigator.getUserMedia(medias, successCallback, errorCallback);//コールバックは下のほうにある
if(useGeo) navigator.geolocation.watchPosition(update); //現在位置情報を定期的に監視

function s_start(){
			//下の動画を再生させるので、ちょっとオマジナイを唱える
/*とりあえず動画は再生させない
			var playerWindow = document.getElementById("videoplayer").contentWindow;
			playerWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
			//唱えた
動画終了
*/

			document.getElementById("s_start").innerHTML="Sited: selected";
			document.getElementById("s_start").disabled="true";
			document.getElementById("b_start").disabled="true";

//サーバーから監視対象の情報を引っ張る
connection_update();
setInterval("connection_update();",20000);
setInterval("collision_detection();",5000);
}

function b_start(){
			document.getElementById("s_start").disabled="true";
			document.getElementById("b_start").innerHTML="Blind: selected";
			document.getElementById("b_start").disabled="true";
//監視対象として登録要請
	xhr.open("GET",server_addr+"?action=new");//とりあえずうちのサーバになってる
	xhr.send();
	xhr.addEventListener("load",function(ev){//結果が返ってきたときにコールバック
blind_id=xhr.response;
	xhr.removeEventListener("load", arguments.callee, false);//次のリクエストでこの関数がコールバックされないように
});
setInterval("blind_update();",20000);
}

function notify(){
			document.getElementById("notification_area").innerHTML='<font color="red">A person with a white cane is approaching. Be careful.</font>';//とりあえず色をそれっぽく。実際、ちゃんとなってるかは知らない。
			setTimeout("clear_notification();",5000);//しばらくしたら通知は消す
}

function connection_update(){//サーバーから監視対象の情報を引っ張る
	xhr.open("GET",server_addr+"?action=retrieve");//とりあえずうちのサーバになってる
	xhr.send();
	xhr.addEventListener("load",function(ev){//結果が返ってきたときにコールバック
if(xhr.response==""){//空のレスポンスだったら、監視対象がいない
connections=[];
}else{//だれかいる
	var tmp=xhr.response.split("\n");//貰ったデータを、まずは1件1件に分ける
	for(var i=0;i<tmp.length;i++){//次は値ごとに分けて2次元配列にぶっこむ
		if(tmp[i]=="") continue;
		var tmp2=tmp[i].split(",");
		var array_tmp=[parseFloat(tmp2[1]),parseFloat(tmp2[2]),parseFloat(tmp2[3])];
		connections[i]=array_tmp;
	}
}
	xhr.removeEventListener("load", arguments.callee, false);//次のリクエストでこの関数がコールバックされないように
});
}

function clear_notification(){
	var button=document.getElementById("start_and_approach");
	button.innerHTML="Approach!";
	button.disabled="";
	document.getElementById("notification_area").innerHTML='';
}


    function update(position){//自分の位置情報が更新されたら
	lat = position.coords.latitude; //緯度
	lng = position.coords.longitude; //経度
}

function collision_detection(){
var ret=false;
for(var i=0;i<connections.length;i++){
var rdef=Math.abs(lat-connections[i][0]);
var ldef=Math.abs(lng-connections[i][1]);
if(rdef<=threshold && ldef<=threshold){
ret=true;
break;
}
if(connections[i][2]>=3.0){
ret=true;
break;
}
}
if(ret){
document.getElementById("notification_area").innerHTML="A blind person is approaching. May be great if you could help if he or she needs.";
}else{
document.getElementById("notification_area").innerHTML="";
}
}

function blind_update(){
	xhr.open("GET",server_addr+"?action=update&n="+blind_id+"&i="+lat+"&k="+lng);//とりあえずうちのサーバになってる
	xhr.send();
}

function successCallback(stream) {
  video.srcObject = stream;
};

function errorCallback(err) {
  alert(err);
};
