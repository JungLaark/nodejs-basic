/** (1) 모듈참조, 필요한 변수 생성 */
var fs = require('fs');					// FileSystem 모듈 참조
var path = require('path');				// Path 모듈 참조
var target = path.join(__dirname, './output.txt');	// 파일경로
var content = "Hello World";			// 저장할 내용
var is_exists = fs.existsSync(target);	// 파일의 존재 여부 검사

if (!is_exists) {
	/** (2) 파일이 존재하지 않을 경우 새로 저장 */
	// 절대경로 지정, 비동기식 파일 저장
	fs.writeFile(target, content, 'utf8', function(err) {
		if(err) { return console.log(err); }
		console.log(target + '에 데이터 쓰기 완료.');

		// 퍼미션 설정
		fs.chmod(target, 0766, function(err) {
			if(err) { return console.log(err); }
			console.log(target + '의 퍼미션 설정 완료');
		});
	});

	console.log(target + '의 파일 저장을 요청했습니다.');
} else {
	/** (3) 파일이 존재할 경우 파일 삭제 */
	fs.unlink(target, function(err) {
		if (err) {  return console.log(err); }
		console.log(target + '의 파일 삭제 완료');
	});

	console.log(target + '의 파일 삭제를 요청했습니다.');
}