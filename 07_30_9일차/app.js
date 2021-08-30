const express = require('express');
const url = require('url');
const path = require('path');
const userAgent = require('express-useragent');
const static = require('serve-static');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const logger = require('../07_21_5일차/1/logHelper');
const util = require('../07_28_8일차/util_helper');
//import 하는게 너무 많다 

//express 호출 
const app = express();

//미들웨어 
app.use(userAgent.express());

//클라이언트 접속 처리
app.use((req, res, next) => {
    logger.debug(" --- 클라이언트가 접속했습니다. ---");

    //클라이언트가 접속한 시간 
    const beginTime = Date.now();

    //클라이언트의 주소 
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    //클라이언트의 디바이스 정보 기록(UserAgent 사용)

   // logger.debug(ip + req.userAgent.os + req.userAgent)

    //클라이언트가 요청한 페이지 url
    const current_url = url.format({
        protocol : req.protocol,
        host: req.get('host'),
        port: req.port,
        pathname: req.originalUrl
    });

    logger.debug(current_url + '/' + decodeURIComponent(current_url));


    //클라이언트의 접속이 종료된 경우의 이벤트
    res.on('finish', () => {
        const endTime = Date.now();

        const time = endTime - beginTime;
        logger.debug('클라이언트의 접속이 종료되었습니다. [runtime] ' + time);
        logger.debug('');
    });

    //이 콜백함수를 종료하고 요청 url에 연결된 기능으로 제어를 넘김
    next();
});

//정적파일을 url에 노출시킬 폴더와 연걸 
const public_path = path.join(__dirname, '../public');
app.use(static(public_path));
app.use(favicon(public_path + '/favicon.png'));

//router 등록 - 보통 맨 마지막에 설정 
const router = express.Router();
//최상위 
app.use('/', router);
//미들웨어 === 페이지 정의 
router.route("/page1").get((req, res, next) => {
    //브라우저에 전달할 응답 내용 router 기능 사용 
    //첫번째 방법
    let html = "<h1>Page1</h1>";
    html += "<h2>express 로 구현한 node.js 백앤드 페이지</h2>";

    res.status(200);
    res.send(html);
});
router.route("/page2").get((req, res, next) => {
    //두번째방법
    //express 기능 사용 
    let html = "<h1>Page2</h1>";
    html += "<h2>express 로 구현한 node.js 백앤드 페이지</h2>";

    res.writeHead(200);
    res.write(html);
    res.end();
    //이건 왜 한글이 깨지지? 
});
router.route("/page3").get((req, res, next) => {
    //페이지 강제이동 redirect
    res.redirect("http://naver.com");
});

//backend 가동 
const port = 3000;
const ip = util.myip();
app.listen(port, () => {
    ip.forEach((v, i) => {
        logger.debug('-------------------------------------');
        logger.debug('-------------------------------------');
        logger.debug(i.address + ',' + i.port);
    });
});
