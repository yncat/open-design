//�P���ɒʒm���o�������̃v���O�����B
var started=false;//�X�^�[�g�{�^����������
function start(){
	switch(started){
		case false:
			started=true;
			//���̓�����Đ�������̂ŁA������ƃI�}�W�i�C��������
			var playerWindow = document.getElementById("videoplayer").contentWindow;
			playerWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
			//������
			document.getElementById("start_and_approach").innerHTML="Approach!";
			break;
		case true:
			var btn=document.getElementById("start_and_approach");
			btn.innerHTML="Approaching!";
			btn.disabled="true";
			document.getElementById("notification_area").innerHTML='<font color="red">A person with a white cane is approaching. Be careful.</font>';//�Ƃ肠�����F��������ۂ��B���ہA�����ƂȂ��Ă邩�͒m��Ȃ��B
			setTimeout("clear_notification();",5000);//���΂炭������ʒm�͏���
			break;
		}
	}

function clear_notification(){
	var button=document.getElementById("start_and_approach");
	button.innerHTML="Approach!";
	button.disabled="";
	document.getElementById("notification_area").innerHTML='';
}
