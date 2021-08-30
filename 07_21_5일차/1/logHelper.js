const fileHelper = require('./fileHelper');
const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const path = require('path');
const config = require('./config.js');

fileHelper.mkdirs(config.log.debug.path);
fileHelper.mkdirs(config.log.error.path);

//로그가 출력될 형식 지정 함수 참조 
const {combine, timestamp, printf} = winston.format;

//로그가 출력될 형식 지정 함수참조 
const logger = winston.createLogger({
    //전반적인 형식 정의 
    format : combine(
        timestamp({
            format : 'YY/MM/DD HH:mm:ss SSS'
        }),
        printf((info) => {
            return `${info.timestamp} [${info.level}]: \t${info.message}`;
        })
    ),
    //일반 로그 규칙 정의 
    transports : [
        new winstonDaily({
            name: 'debug-file',
            level: config.log.debug.level,  // 출력할 로그의 수준. 저정된 수준보다 중요도 높은 값만 출력
            datePattern: 'YYMMDD',          // 파일 이름에 표시될 날짜형식
            dirname: config.log.debug.path, // 파일이 저장될 위치
            filename: 'log_%DATE%.log',     // 파일이름 형식. %DATE%는 datePattern의 값
            maxsize: 50000000,
            maxFiles: 50,
            zippedArchive: true,
        }),

        // 하루에 하나씩 파일 형태로 기록하기 위한 설정
        new winstonDaily({
            name: 'error-file',
            level: config.log.error.level,
            datePattern: 'YYMMDD', // 날짜형식
            dirname: config.log.debug.path,
            filename: 'error_%DATE%.log',
            maxsize: 50000000,
            maxFiles: 50,
            zippedArchive: true,
        }), 
    ]

});

//프로덕션 버전(=상용화 버전) 이 아니라면? 
if(process.env.NODE_ENV !== 'production'){
    logger.add(
        new winston.transports.Console({
            format : combine(winston.format.colorize(), winston.format.simple())
        })
    )
}

module.exports = logger;