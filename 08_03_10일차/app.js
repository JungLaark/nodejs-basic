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

//post 파라미넡 수신 모듈 설정 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
//하나 추가해야 함 

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

//get 
router.route('/send_get').get((req, res, next) =>{
    //get 파라미터는 req.query 하위 데이터로 저장됨 

    for(key in req.query){
        const str = "frontend로부터 전달받은 변수 ::: " +key+"="+req.query[key];
        logger.debug(str);
    }

    const answer = req.query.answer;
    let html = null;

    if(parseInt(answer) === 300){
        html = "<h1 style='color:#0066ff'>정답입니다.</h1>";
    }else{
        html = "<h1 style='color:#ff6600'>틀렸습니다.</h1>";
    }

    res.status(200).send(html);
}); 

//url 파라미터 
//http://sdfdf/페이지이름/변수1/변수2
//콜론을 붙이면 변수가 된다
router.route('/send_url/:username/:age').get((req, res, next) => {
    //req.param 하위 데이터로 감 
    for(key in req.params){
        const str = "frontend로부터 전달받은 변수 ::: " +key+"="+req.query[key];
        logger.debug(str);
    }

    const html = "<h1>" + req.params.username + "님은" + req.params.age + "살입니다.";
});

//post
router.route('/send_post').post((req, res, next) => {
    //req.param 하위 데이터로 감 
    for(key in req.body){
        const str = "frontend로부터 전달받은 변수 ::: " +key+"="+req.query[key];
        logger.debug(str);
    }

    const html = "<h1>" + req.params.username + "님은" + req.params.age + "살입니다.";
});

//RESTful
/** 상품에 대한 Restful API 정의하기 */
// 위의 형태처럼 개별적인 함수로 구현 가능하지만 대부분 하나의 URL에 메서드 체인을 사용해서 4가지 전송방식을 한번에 구현
router.route("/product")
    .get((req, res, next) => {
        // URL Params 형식으로 조회할 상품의 일련번호를 전달받아야 한다.
        const html = "<h1><span style='color:#0066ff'>" + req.query.productNumber + "</span>번 상품 <span style='color:#ff6600'>조회</span>하기</h1>";
        res.status(200).send(html);
    })
    .post((req, res, next) => {
        // <form> 상에 저장할 상품 정보를 입력 후 전송한다.(주로 관리자 기능)
        // 저장시에는 일련번호는 전송하지 않으며 저장후 자동으로 발급되는 일련번호를 프론트에게 돌려줘야 한다.
        const html = "<h1><span style='color:#0066ff'>" + req.body.productNumber + "</span> 상품 <span style='color:#ff6600'>등록</span>하기</h1>";
        res.status(200).send(html);
    })
    .put((req, res, next) => {
        // <form> 상에 수정 상품 정보를 입력 후 전송한다.(주로 관리자 기능)
        // 몇번 상품을 수정할지 식별하기 위해 상품 일련번호가 함께 전송된다.
        const html = "<h1><span style='color:#0066ff'>" + req.body.productNumber + "</span> 상품 <span style='color:#ff6600'>수정</span>하기</h1>";
        res.status(200).send(html);
    })
    .delete((req, res, next) => {
        // 삭제할 상품의 일련번호 전송
        const html = "<h1><span style='color:#0066ff'>" + req.body.productNumber + "</span> 상품 <span style='color:#ff6600'>삭제</span>하기</h1>";
        res.status(200).send(html);
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
