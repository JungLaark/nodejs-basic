const os = require('os');
//시스템 기본 정보
console.log('홈 디렉토리:' + os.homedir());
console.log('시스템 아키텍쳐:' + os.arch());
console.log('os platform:' + os.platform());
console.log('시스템 임시 디렉토리:' + os.tmpdir());
console.log('시스템의 hostname:' + os.hostname());

//사설 ip 공인 pi

//사용자 계정 정보 
const userInfo = os.userInfo();

userInfo.username;
userInfo.homedir;
userInfo.shell;

//메모리 용량 
os.freemem();
os.totalmem();


//cpu 정보 
const cpus = os.cpus();
//코어 수 
cpus.length;

for(var i=0; i<cpus.length; i++){
    console.log("[%d번째 CPU] %s", i+1, cpus[i].model);
	console.log("처리속도: %d", cpus[i].speed);
	console.log("수행시간 정보: %j", cpus[i].times);
	console.log();
}

//tcpip 몇개의 이진수를 끊어서 전송할까 
/** (2) 네트워크 정보 */
var nets = os.networkInterfaces();

for (var attr in nets) {
	console.log("Network장치 이름: %s", attr);
	console.log();

	const item = nets[attr];
	for (var j=0; j<item.length; j++) {
		console.log("주소형식: %s", item[j].family);
		console.log("IP주소: %s", item[j].address);
		console.log("맥주소: %s", item[j].mac);
		console.log("넷마스크: %s", item[j].netmask);
		console.log();
	}
	console.log();
}