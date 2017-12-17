//単純に通知を出すだけのプログラム。
var started=false;//スタートボタン押したか
function start(){
	switch(started){
		case false:
			started=true;
			//下の動画を再生させるので、ちょっとオマジナイを唱える
			var playerWindow = document.getElementById("videoplayer").contentWindow;
			playerWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
			//唱えた
			document.getElementById("start_and_approach").innerHTML="Approach!";
			break;
		case true:
			var btn=document.getElementById("start_and_approach");
			btn.innerHTML="Approaching!";
			btn.disabled="true";
			document.getElementById("notification_area").innerHTML='<font color="red">A person with a white cane is approaching. Be careful.</font>';//とりあえず色をそれっぽく。実際、ちゃんとなってるかは知らない。
			setTimeout("clear_notification();",5000);//しばらくしたら通知は消す
			break;
		}
	}

function clear_notification(){
	var button=document.getElementById("start_and_approach");
	button.innerHTML="Approach!";
	button.disabled="";
	document.getElementById("notification_area").innerHTML='';
}
