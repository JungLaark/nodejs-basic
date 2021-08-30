/*----------------------------------------------------------
 | 1) 모듈참조
 -----------------------------------------------------------*/
const express = require("express");
const url = require("url");
const path = require("path");
const userAgent = require("express-useragent");
const static = require("serve-static");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const logger = require("../07_21_5일차/1/logHelper");
const util = require("../07_28_8일차/util_helper");
const cookieParser = require("cookie-parser");
const { request } = require("http");

/*----------------------------------------------------------
   | 2) Express 객체 생성
   -----------------------------------------------------------*/
// 여기서 생성한 app 객체의 use() 함수를 사용해서
// 각종 외부 기능, 설정 내용, URL을 계속해서 확장하는 형태로 구현이 진행된다.
const app = express();

/*----------------------------------------------------------
   | 3) 클라이언트의 접속시 초기화
   -----------------------------------------------------------*/
/** UserAgent 모듈 탑재 */
//  --> 미들웨어의 콜백함수에 전달되는 req, res객체를 확장하기 때문에
//      다른 모듈들보다 먼저 설정되어야 한다.
app.use(userAgent.express());

app.use((req, res, next) => {
  logger.debug("클라이언트가 접속했습니다.");

  // 클라이언트가 접속한 시간
  const beginTime = Date.now();

  // 클라이언트의 IP주소
  const ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  // 클라이언트의 디바이스 정보 기록 (UserAgent 사용)
  logger.debug(
    "[client] " +
      ip +
      " / " +
      req.useragent.os +
      " / " +
      req.useragent.browser +
      "(" +
      req.useragent.version +
      ") / " +
      req.useragent.platform
  );

  // 클라이언트가 요청한 페이지 URL
  // 콜백함수에 전달되는 req 파라미터는 클라이언트가 요청한 URL의 각 부분을 변수로 담고 있다.
  const current_url = url.format({
    protocol: req.protocol, // ex) http://
    host: req.get("host"), // ex) 172.16.141.1
    port: req.port, // ex) 3000
    pathname: req.originalUrl, // ex) /page1.html
  });

  logger.debug("[" + req.method + "] " + decodeURIComponent(current_url));

  // 클라이언트의 접속이 종료된 경우의 이벤트
  res.on("finish", () => {
    // 접속 종료시간
    const endTime = Date.now();

    // 이번 접속에서 클라이언트가 머문 시간 = 백엔드가 실행하는게 걸린 시간
    const time = endTime - beginTime;
    logger.debug(
      "클라이언트의 접속이 종료되었습니다. ::: [runtime] " + time + "ms"
    );
    logger.debug("--------------------------------------------------");
  });

  // 이 콜백함수를 종료하고 요청 URL에 연결된 기능으로 제어를 넘김
  next();
});

/*----------------------------------------------------------
   | 4) Express 객체의 추가 설정
   -----------------------------------------------------------*/
/** POST 파라미터 수신 모듈 설정.
    추가 모듈들 중 UserAgent를 제외하고 가장 먼저 설정해야 함 */
// body-parser를 이용해 application/x-www-form-urlencoded 파싱
// extended: true --> 지속적 사용.
// extended: false --> 한번만 사용.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text()); // TEXT형식의 파라미터 수신 가능.
app.use(bodyParser.json()); // JSON형식의 파라미터 수신 가능.

/** HTTP PUT, DELETE 전송방식 확장 */
// 브라우저 개발사들이 PUT, DELETE 방식으로 전송하는 HTTP Header 이름
app.use(methodOverride("X-HTTP-Method")); // Microsoft
app.use(methodOverride("X-HTTP-Method-Override")); // Google/GData
app.use(methodOverride("X-Method-Override")); // IBM
// HTML폼에서 PUT,DELETE로 전송할 경우 post방식을 사용하되, action 주소에 "?_method" 라고 추가.
app.use(methodOverride("_method")); // HTML form
//cookie parser
const cookie_encrypt_key = "helloworld";
app.use(cookieParser(cookie_encrypt_key));

/** HTML,CSS,IMG,JS 등의 정적 파일을 URL에 노출시킬 폴더 연결 */
// "http://아이피:포트번호" 이후의 경로가 router에 등록되지 않은 경로라면
// static 모듈에 연결된 폴더 안에서 해당 경로를 탐색한다.
const public_path = path.join(__dirname, "../public");
app.use(static(public_path));

/** favicon 설정 */
app.use(favicon(public_path + "/favicon.png"));

/** 라우터(URL 분배기) 객체 설정 --> 맨 마지막에 설정 */
const router = express.Router();
// 라우터를 express에 등록
app.use("/", router);

/*----------------------------------------------------------
   | 5) 각 URL별 백엔드 기능(=미들웨어=페이지) 정의
   -----------------------------------------------------------*/
//cookie test
router
  .route("/cookie")
  .post((req, res, next) => {
    // URL 파라미터들은 req.body 객체의 하위 데이터로 저장된다.
    for (key in req.body) {
      const str = "[" + req.method + "] " + key + "=" + req.body[key];
      logger.debug(str, "node");
    }

    // 일반 쿠키 저장하기 -> 유효시간을 30초로 설정
    res.cookie("my_msg", req.body.msg, { maxAge: 30 * 1000, path: "/" });

    // 암호화된 쿠키 저장하기 -> 유효시간을 30초로 설정
    res.cookie("my_msg_signed", req.body.msg, {
      maxAge: 30 * 1000,
      path: "/",
      signed: true,
    });

    res.status(200).send("ok");
  })
  .get((req, res, next) => {
    // 기본 쿠키값들은 req.cookies 객체의 하위 데이터로 저장된다. (일반 데이터)
    for (key in req.cookies) {
      const str = "[cookies] " + key + "=" + req.cookies[key];
      logger.debug(str, "node");
    }

    // 암호화 된 쿠키값들은 req.signedCookies 객체의 하위 데이터로 저장된다. (일반 데이터)
    for (key in req.signedCookies) {
      const str = "[signedCookies] " + key + "=" + req.signedCookies[key];
      logger.debug(str, "node");
    }

    // 원하는 쿠키값을 가져온다.
    const my_msg = req.cookies.my_msg;
    const my_msg_signed = req.signedCookies.my_msg_signed;

    const result_data = {
      my_msg: my_msg,
      my_msg_signed: my_msg_signed,
    };
    logger.debug(JSON.stringify(result_data));
    res.status(200).send(result_data);
  })
  .delete((req, res, next) => {
    // 저장시 domain, path 를 설정했다면 삭제시에도 동일한 값을 지정해야 함
    res.clearCookie("my_msg", { path: "/" });
    res.clearCookie("my_msg_signed", { path: "/" });
    res.status(200).send("clear");
  });

/*----------------------------------------------------------
   | 6) 설정한 내용을 기반으로 서버 구동 시작
   -----------------------------------------------------------*/
// 백엔드를 가동하 3000번 포트에서 대기
const port = 3000;
const ip = util.myip();

app.listen(port, () => {
  logger.debug("--------------------------------------------------");
  logger.debug("|              Start Express Server              |");
  logger.debug("--------------------------------------------------");

  ip.forEach((v, i) => {
    logger.debug("server address => http://" + v + ":" + port);
  });

  logger.debug("--------------------------------------------------");
});
