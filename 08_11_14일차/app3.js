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
 
 // 업로드 모듈
 const multer = require('multer');
 // 썸네일 이미지 생성 모듈
 const thumbnail = require('node-thumbnail').thumb;
 
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
 router.route('/upload/simple').post((req, res, next) => {
     const upload = multipart.single('myphoto');
 
     upload(req, res, (err) => {
         let result_code = 200;
         let result_msg = 'ok';
 
         if (err) {
             if (err instanceof multer.MulterError) {
                 switch (err.code) {
                     case 'LIMIT_FILE_COUNT':
                         err.result_code = 500;
                         err.result_msg = '업로드 가능한 파일 수를 초과했습니다.';
                         break;
                     case 'LIMIT_FILE_SIZE':
                         err.result_code = 500;
                         err.result_msg = '업로드 가능한 파일 용량를 초과했습니다.';
                         break;
                     default:
                         err.result_code = 500;
                         err.result_msg = '알 수 없는 에러가 발생했습니다.';
                         break;
                 }
             }
             logger.error(err);
             result_code = err.result_code;
             result_msg = err.result_msg;
         }
 
         res.status(result_code).send(result_msg);
     });
 });
 
 router.route('/upload/multiple').post((req, res, next) => {
     const upload = multipart.array('myphoto');
     upload(req, res, (err) => {
         let result_code = 200;
         let result_msg = 'ok';
 
         if (err) {
             if (err instanceof multer.MulterError) {
                 switch (err.code) {
                     case 'LIMIT_FILE_COUNT':
                         err.result_code = 500;
                         err.result_msg = '업로드 가능한 파일 수를 초과했습니다.';
                         break;
                     case 'LIMIT_FILE_SIZE':
                         err.result_code = 500;
                         err.result_msg = '업로드 가능한 파일 용량를 초과했습니다.';
                         break;
                     default:
                         err.result_code = 500;
                         err.result_msg = '알 수 없는 에러가 발생했습니다.';
                         break;
                 }
             }
             logger.error(err);
             result_code = err.result_code;
             result_msg = err.result_msg;
         }
 
         res.status(result_code).send(result_msg);
     });
 });
 
 router.route('/upload/api').post((req, res, next) => {
     const upload = multipart.single('myphoto');
 
     upload(req, res, (err) => {
         let result_code = 200;
         let result_msg = 'ok';
 
         if (err) {
             if (err instanceof multer.MulterError) {
                 switch (err.code) {
                     case 'LIMIT_FILE_COUNT':
                         err.result_code = 500;
                         err.result_msg = '업로드 가능한 파일 수를 초과했습니다.';
                         break;
                     case 'LIMIT_FILE_SIZE':
                         err.result_code = 500;
                         err.result_msg = '업로드 가능한 파일 용량를 초과했습니다.';
                         break;
                     default:
                         err.result_code = 500;
                         err.result_msg = '알 수 없는 에러가 발생했습니다.';
                         break;
                 }
             }
             logger.error(err);
             result_code = err.result_code;
             result_msg = err.result_msg;
         }
 
         /** 업로드 결과에 이상이 없다면 썸네일 이미지 생성 */
         const thumb_size_list = [640, 750, 1020];
 
         (async () => {
             // 원하는 썸네일 사이즈만큼 반복처리
             for (let i=0; i<thumb_size_list.length; i++) {
                 const v = thumb_size_list[i];
 
                 // 생성될 썸네일 파일의 옵션과 파일이름을 생성
                 const thumb_options = {
                     source: req.file.path, // 썸네일을 생성할 원본 경로
                     destination: thumb_path, // 썸네일이 생성될 경로
                     width: v, // 썸네일의 크기(기본값 800),
                     prefix: 'thumb_',
                     suffix: '_' + v + 'w',
                     override: true,
                 };
 
                 // 생성될 썸네일 파일의 이름을 예상
                 const basename = req.file.savename;
                 const filename = basename.substring(0, basename.lastIndexOf('.'));
                 const thumbname = thumb_options.prefix + filename + thumb_options.suffix + path.extname(basename);
 
                 // 썸네일 정보를 width를 key로 갖는 json 형태로 추가하기 위해 key 이름 생성
                 const key = v + 'w';
 
                 // 프론트엔드에게 전송될 정보에 'thumbnail'이라는 프로퍼티가 없다면 빈 json 형태로 생성
                 if (!req.file.hasOwnProperty('thumbnail')) {
                     req.file.thumbnail = {};
                 }
 
                 req.file.thumbnail[key] = '/thumb/' + thumbname;
 
                 try {
                     await thumbnail(thumb_options);
                 } catch (error) {
                     console.error(error);
                 }
             }
 
             // 프론트엔드에게 전송할 내용을 JSON으로 구성
             const result = {
                 rtcode: result_code,
                 rtmsg: result_msg,
                 item: req.file,
             };
     
             console.log(result);
     
             // async 함수 안에서 사용되었으므로 await 명령이 지정된 함수 실행이 종료된 후 여기가 실행될 수 있다.
             res.status(result_code).send(result);
         })();
     });
 });
 
 /*----------------------------------------------------------
   | 6) 설정한 내용을 기반으로 서버 구동 시작
   -----------------------------------------------------------*/
 // 백엔드를 가동하 3000번 포트에서 대기
 const port = 3000;
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