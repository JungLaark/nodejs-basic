const logger = require('../07_21_5일차/1/logHelper');
const http = require('http');

/*웹 서버 구동*/
const server = http.createServer();
const port = 3217;

server.listen(port, () => {
    logger.debug( port + "번 포트에서 서버가 구동되었습니다");
});

/*몇가지 이벤트를 건다, 연결했을 때의  */
server.on('connection', (socket) => {
    //콜백함수에 전달되는 socket객체를 사용하여 접속한 클라이언트의 정보를 파악
    console.log(socket);

    logger.debug("프론트엔드가 접속했습니다. : " +  socket.remoteAddress +" "+ socket.remotePort);
});

//connetion 이벤트 발생 직 후에 값을 응답하기 위한 이벤트 

/** connection이벤트 발생 직후 프론트엔드에게 결과값을 되돌려 주기 위해 호출되는 이벤트 */
// req(request) -> 요청객체 : 브라우저가 서버에게 전달하는 정보를 담고 있다.
// res(response) -> 응답객체 : 서버가 브라우저에게 결과를 전송하는 기능을 갖는다.
server.on('request', (req, res) => {
    logger.debug('프론트엔드의 요청 >> [' + req.method + "] " + req.url);

    // 클라이언트에게 전송할 응답 헤더 구성
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});

    // 클라이언트에 전송할 본문 구성
	res.write("<!DOCTYPE html>");
	res.write("<html>");
	res.write("  <head>");
	res.write("    <meta charset='utf-8' />");
	res.write("    <title>응답 페이지</title>");
	res.write("  </head>");
	res.write("  <body>");

    // 프론트엔드가 요청한 URL에 따라 출력 내용을 분기.
	if (req.url == '/hello.html') {
		res.write("    <h1>Hello World</h1>");
	} else {
		res.write("    <h1>노드제이에스로부터의 응답 페이지</h1>");
	}
	
	res.write("  </body>");
	res.write("</html>");

	// 클라이언트에 데이터 전송 (통신종료)
	res.end();
});

/** 서버 종료 이벤트 */
// 정상적인 상황에서는 발생할 가능성이 없다.
server.on('close', function() {
	logger.debug('백엔드가 종료되었습니다.');
});

// 예제에므로 타이머를 통해 백엔드를 30초 후 강제 종료
setTimeout(() => {
    server.close();
}, 30000);