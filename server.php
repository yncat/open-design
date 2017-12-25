<?php
if(isset($_REQUEST["action"])){//JSとの通信処理用のコマンド軍

if($_REQUEST["action"]=="new"){//新しくユーザー登録
$fc=file("info.dat");
$nums=array();
foreach($fc as $c){
if($c!="") $nums[]=sscanf($c,"%d");
}
$n=0;
while(true){
$n=rand(1,9999);
$found=false;
foreach($nums as $num){
if($num==$n){
$found=true;
break;
}
}
if(!$found) break;
}
$fp=fopen("info.dat","a");
flock($fp,LOCK_EX);
fwrite($fp,sprintf("%s,%s,%s,%s\r\n",$n,0.0,0.0,0));
flock($fp,LOCK_UN);
fclose($fp);
printf("%d",$n);
exit();
}

if($_REQUEST["action"]=="update"){//位置情報の更新
if(!isset($_REQUEST["n"]) or !isset($_REQUEST["i"]) or !isset($_REQUEST["k"])) die("Insaficient parameter");//位置情報がないってどういうこっちゃねん
//パラメータはちゃんとあるらしいから追記
$fc=file("info.dat");
for($i=0;$i<count($fc);$i++){
$current=explode(",",$fc[$i]);
if($_REQUEST["n"]==$current[0]){
$count=(int)$current[3];
$count++;
$fc[$i]=sprintf("%s,%s,%s,%s\r\n",$_REQUEST["n"],$_REQUEST["i"],$_REQUEST["k"],$count);
break;
}
}
$fp=fopen("info.dat","w");
flock($fp,LOCK_EX);
foreach($fc as $c){
fwrite($fp,$c);
}
flock($fp,LOCK_UN);
fclose($fp);
die("OK");
}//追加した

if($_REQUEST["action"]=="retrieve"){//JSから情報がほしいといわれた
if(!file_exists("info.dat")){//登録ファイルがないから作る
$fp=fopen("info.dat","w");
fclose($fp);
}
die(file_get_contents("info.dat"));//持ってる情報をぶん投げる
}
if($_REQUEST["action"]=="clear"){
$fp=fopen("info.dat","w");
flock($fp,LOCK_EX);
fwrite($fp,"");
flock($fp,LOCK_UN);
fclose($fp);
die("cleared.");
}
}//JSとの通信処理終了
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html lang="ja">
<head>
<meta http-equiv=Content-Type content="text/html; charset=utf-8">
<title> Geolocation Server </title>
</head>
<body bgcolor="white" Text="black" 
Link="blue" Vlink="red" Alink="lime">
<p>You are not supposed to open this page. Bye bye, but please visit <a href="http://www.nyanchangames.com/">Here</a> if you are bored or anything.</p>
</body>
</html>