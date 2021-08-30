/** (1) 모듈참조, 필요한 변수 생성 */
var fs = require('fs');					// FileSystem 모듈 참조
var target = './output_sync.txt';		// 저장할 파일의 경로//상대 절대 모두 가능 
var content = "Hello World";			// 저장할 내용
var is_exists = fs.existsSync(target);	// 파일의 존재 여부 검사

if (!is_exists) {
	/** (2) 파일이 존재하지 않을 경우 새로 저장 */
	// 상대경로 지정, 동기식 파일 저장.
	// 이 파일을 다 저장하기 전까지는 프로그램이 대기상태임.
	// 그러므로 대용량 처리에는 적합하지 않음.
	fs.writeFileSync(target, content, 'utf8');

	// 퍼미션 설정 //윈도우에서는 관련없음 
	fs.chmodSync(target, 0766);

	// 파일 저장이 완료된 후에나 메시지가 표시된다.
	console.log(target + ' 파일에 데이터 쓰기 및 퍼미션 설정 완료.');
} else {
	/** (3) 파일이 존재할 경우 파일 삭제 */
	fs.unlinkSync(target)
	console.log(target + ' 파일 삭제 완료.');
}