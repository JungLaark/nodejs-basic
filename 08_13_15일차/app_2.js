/*----------------------------------------------------------
 | 1) 모듈참조
 -----------------------------------------------------------*/
 const logger = require('../helper/log_helper');
 const util = require('../helper/util_helper');
 const file_helper = require('../helper/file_helper');
 const url = require('url');
 const path = require('path');
 const express = require('express');
 const useragent = require('express-useragent');
 const static = require('serve-static');
 const favicon = require('serve-favicon');
 const bodyParser = require('body-parser');
 const methodOverride = require('method-override');
 const cookieParser = require('cookie-parser');
 const expressSession = require('express-session');
 const multer = require('multer');
 const thumbnail = require('node-thumbnail').thumb;
 const nodemailer = require('nodemailer');
 
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
 app.use(useragent.express());
 
 app.use((req, res, next) => {
     logger.debug('클라이언트가 접속했습니다.');
 
     // 클라이언트가 접속한 시간
     const beginTime = Date.now();
 
     // 클라이언트의 IP주소
     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
 
     // 클라이언트의 디바이스 정보 기록 (UserAgent 사용)
     logger.debug('[client] ' + ip + ' / ' + req.useragent.os + ' / ' + req.useragent.browser + '(' + req.useragent.version + ') / ' + req.useragent.platform);
 
     // 클라이언트가 요청한 페이지 URL
     // 콜백함수에 전달되는 req 파라미터는 클라이언트가 요청한 URL의 각 부분을 변수로 담고 있다.
     const current_url = url.format({
         protocol: req.protocol, // ex) http://
         host: req.get('host'), // ex) 172.16.141.1
         port: req.port, // ex) 3000
         pathname: req.originalUrl, // ex) /page1.html
     });
 
     logger.debug('[' + req.method + '] ' + decodeURIComponent(current_url));
 
     // 클라이언트의 접속이 종료된 경우의 이벤트
     res.on('finish', () => {
         // 접속 종료시간
         const endTime = Date.now();
 
         // 이번 접속에서 클라이언트가 머문 시간 = 백엔드가 실행하는게 걸린 시간
         const time = endTime - beginTime;
         logger.debug('클라이언트의 접속이 종료되었습니다. ::: [runtime] ' + time + 'ms');
         logger.debug('--------------------------------------------------');
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
 app.use(methodOverride('X-HTTP-Method')); // Microsoft
 app.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
 app.use(methodOverride('X-Method-Override')); // IBM
 // HTML폼에서 PUT,DELETE로 전송할 경우 post방식을 사용하되, action 주소에 "?_method" 라고 추가.
 app.use(methodOverride('_method')); // HTML form
 
 /** 쿠키를 처리할 수 있는 객체 연결 */
 // cookie-parser는 데이터를 저장,조회 할 때 암호화 처리를 동반한다.
 // 이 때 암호화에 사용되는 key문자열을 개발자가 정해야 한다.
 const cookie_encrypt_key = 'helloworld';
 app.use(cookieParser(cookie_encrypt_key));
 
 /** 세션 설정 */
 app.use(
     expressSession({
         // 암호화 키
         secret: cookie_encrypt_key,
         // 세션을 쿠키 상태로 클라이언트에게 노출시킬지 여부
         resave: false,
         // 세션이 저장되기 전에 기존의 세션을 초기화 상태로 만들지 여부
         saveUninitialized: false,
     })
 );
 
 /** HTML,CSS,IMG,JS 등의 정적 파일을 URL에 노출시킬 폴더 연결 */
 // "http://아이피:포트번호" 이후의 경로가 router에 등록되지 않은 경로라면
 // static 모듈에 연결된 폴더 안에서 해당 경로를 탐색한다.
 const public_path = path.join(__dirname, '../public');
 const upload_path = path.join(__dirname, '../_files/upload');
 const thumb_path = path.join(__dirname, '../_files/thumb');
 // --> public 폴더의 웹 상의 위치 : http://아이피:포트번호/
 app.use('/', static(public_path));
 // --> upload 폴더의 웹 상의 위치 : http://아이피:포트번호/upload
 app.use('/upload', static(upload_path));
 app.use('/thumb', static(thumb_path));
 
 /** favicon 설정 */
 app.use(favicon(public_path + '/favicon.png'));
 
 /** 라우터(URL 분배기) 객체 설정 --> 맨 마지막에 설정 */
 const router = express.Router();
 // 라우터를 express에 등록
 app.use('/', router);
 
 /** multer 객체 생성 --> 파일 제한 : 5개, 20M */
 const multipart = multer({
     storage: multer.diskStorage({
         /** 업로드 된 파일이 저장될 디렉토리 설정 */
         destination: (req, file, callback) => {
             // 폴더 생성
             file_helper.mkdirs(upload_path);
             file_helper.mkdirs(thumb_path);
             // 업로드 정보에 백엔드의 업로드 파일 저장 폴더 위치를 추가한다.
             file.dir = upload_path.replace(/\\/gi, '/');
             // multer 객체에게 업로드 경로를 전달
             callback(null, upload_path);
         },
         /** 업로드 된 파일이 저장될 파일명 설정 */
         filename: (req, file, callback) => {
             // 파일의 확장자만 추출
             const extName = path.extname(file.originalname);
             // 파일이 저장될 이름 (현재 식각)
             const saveName = new Date().getTime().toString() + extName.toLowerCase();
             // 업로드 정보에 백엔드의 업로드 파일 이름을 추가한다.
             file.savename = saveName;
             // 경로문자열에서 역슬래시를 슬래시로 변경
             file.url = path.join('/upload', saveName).replace(/\\/gi, '/');
             // 구성된 정보를 req 객체에게 추가
             req.file = file;
             callback(null, saveName);
         },
     }),
     limits: {
         files: 5,
         fileSize: 1024 * 1024 * 20,
     },
     /** 업로드 될 파일의 확장자 제한 */
     fileFilter: (req, file, callback) => {
         // 파일의 종류 얻기
         var mimetype = file.mimetype;
 
         // 파일 종류 문자열에 "image/"가 포함되어 있지 않은 경우
         if (mimetype.indexOf('image/') == -1) {
             const err = new Error();
             err.result_code = 500;
             err.result_msg = '이미지 파일만 업로드 가능합니다.';
             return callback(err);
         }
         callback(null, true);
     },
 });
 
 /*----------------------------------------------------------
   | 5) 각 URL별 백엔드 기능(=미들웨어=페이지) 정의
   -----------------------------------------------------------*/
 router.route('/mail/simple').post((req, res, next) => {
        /** 1) 프론트엔드에서 전달한 사용자 입력값 */
        const writer_name = req.body.writer_name;
        let writer_email = req.body.writer_email;
        const receiver_name = req.body.receiver_name;
        let receiver_email = req.body.receiver_email;
        const subject = req.body.subject;
        const content = req.body.content;

        /** 2) 보내는 사람, 받는 사람의 메일주소와 이름 */
        // 보내는 사람의 이름과 주소
        if (writer_name) {
            // ex) 이광호 <leekh4232@gmail.com>
            writer_email = writer_name + " <" + writer_email + ">";
        }

        // 받는 사람의 이름과 주소
        if (receiver_name) {
            receiver_email = receiver_name + " <" + receiver_email + ">";
        }

        /** 3) 메일 발송정보 구성 */
	    const send_info = { from: writer_email, to: receiver_email, subject: subject, html: content };
        logger.debug(JSON.stringify(send_info));

        /** 4) 메일 발송 서버 인증 */
	    // const smtp = nodemailer.createTransport({
        //     // 수동설정
	    //     //host: 'smtp.naver.com', // SMTP 서버명 : smtp.naver.com
	    //     //port: 465,              // SMTP 포트 : 465
	    //     //secure: true,           // 보안연결(SSL) 필요
        //     // 자동설정
        //     service: 'Naver',
	    //     auth: { user: '네이버아이디', pass: '네이버비밀번호' }
	    // });

        const smtp = nodemailer.createTransport({
	        //host: 'smtp.gmail.com', // SMTP 서버명 : smtp.gmail.com
	        //port: 587,              // SMTP 포트 : 587
	        //secure: true,           // 보안연결(SSL) 필요
            // 자동설정
            service: 'Gmail',
	        auth: { user: 'leekh4232@gmail.com', pass: 'ksbcxrojtxriggfu' }
	    });

        smtp.sendMail(send_info, function(error) {
	        if (error) {
                console.error(error);
                return res.status(500).send("error");
            }
	        res.status(200).send("ok");
	    });
 });
 
 /*----------------------------------------------------------
   | 6) 설정한 내용을 기반으로 서버 구동 시작
   -----------------------------------------------------------*/
 // 백엔드를 가동하 3000번 포트에서 대기
 const port = 3030;
 const ip = util.myip();
 
 app.listen(port, () => {
     logger.debug('--------------------------------------------------');
     logger.debug('|              Start Express Server              |');
     logger.debug('--------------------------------------------------');
 
     ip.forEach((v, i) => {
         logger.debug('server address => http://' + v + ':' + port);
     });
 
     logger.debug('--------------------------------------------------');
 });