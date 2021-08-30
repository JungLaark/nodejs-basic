/** 모듈참조 */
const logger = require('../helper/log_helper');
const util = require('./util_helper');
const http = require('http');

/** 웹 서버 구동 */
const port = 3217;                  // 포트번호 설정
const ip = util.myip();
const server = http.createServer((req, res) => {
    logger.debug('프론트엔드의 요청 >> [' + req.method + '] ' + req.url);

    // 클라이언트에게 전송할 응답 헤더 구성
    res.writeHead(200, { 
        // 브라우저에게 인식시킬 출력 내용의 컨텐츠 형식
        'Content-Type': 'application/json; charset=utf-8',
        // 접근을 허용할 도메인(브라우저에 출력되고 있는 도메인을 의미함, *은 ALL의 의미)
        'Access-Control-Allow-Origin' : '*',
        // 접근을 허용할 전송방식 (기본값은 GET, POST만 허용함)
        'Access-Control-Allow-Methods' : '*',
    });

    let json = null;

    switch(req.method) {
        case 'GET':     // 데이터 조회 기능
            json = {
                message: 'GET방식에 대한 요청입니다.'
            }
            break;
        case 'POST':    // 데이터 저장 기능
            json = {
                message: 'POST방식에 대한 요청입니다.'
            }
            break;
        case 'PUT':     // 데이터 수정 기능
            json = {
                message: 'PUT방식에 대한 요청입니다.'
            }
            break;
        case 'DELETE':  // 데이터 삭제
            json = {
                message: 'DELETE방식에 대한 요청입니다.'
            }
            break;
    }

    // JSON을 문자열로 변환후 출력 
    res.write(JSON.stringify(json));
    // 출력 종료를 알림
    res.end();
});

/** 포트번호에 대해 리스닝 시작 */
server.listen(port, () => {
    logger.debug(port + '번 포트에서 백엔드가 구동되었습니다.');
    logger.debug('-----------------------');

    ip.forEach((v, i) => {
        logger.debug('http://' + v + ':' + port);
    });
});

/** 프론트엔드가 접속했을 때 발생하는 이벤트 */
server.on('connection', (socket) => {
    // 콜백함수에 전달되는 socket 객체를 사용하여 접속한 클라이언트의 정보를 파악한다.
    logger.debug('프론트엔드가 접속했습니다. : ' + socket.remoteAddress + ', ' + socket.remotePort);
    logger.debug(socket);
});

/** 서버 종료 이벤트 */
// 정상적인 상황에서는 발생할 가능성이 없다.
server.on('close', function () {
    logger.debug('백엔드가 종료되었습니다.');
});