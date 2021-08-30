const winston = require('winston');
const path = require('path');
const fileHelper = require('./fileHelper.js');
const dayjs = require('dayjs');
const { config } = require('winston');
//로그 수준 정의하기 
//수준의 이름들이 winston의 함수 이름이 된다

const log_config = {
    //로그 파일이 저장될 경로 및 출력 레벨 지정
    log :{
        debug : {
            path : path.join(__dirname, "../files/_logs"),
            level : 'debug'
        },
        error : {
            path : path.join(__dirname, "../files/_logs"),
            level : 'error'
        },
        levels : {
            error:0, warn:1, info:2, debug:3, sql:4, verbose:5
        },
        colors : {
            error : 'red', warn : 'yellow', info : 'green', debug : 'blue', sql : 'gray', verbose : 'grey'
        }
    }
}

fileHelper.mkdirs(log_config.log.debug.path);
fileHelper.mkdirs(log_config.log.error.path);

const timeStampFormat = () => {
    const now_str = dayjs().format('YYYY-MM-DD HH:mm:ss SSS')
    //console.log(Date.now());
    //console.log(now_str);
    const stamp = now_str + "[pid : " + process.pid + "]";
    return stamp;
}


console.debug(timeStampFormat());

//winston 객체 만들기 
const logger = new (winston.Logger)({
    //로그 수준 정의 
    levels : log_config.log.levels,
    colors : log_config.log.colors,
    //일반 로그 규칙 정의 
    transports : [
        //직접 콘솔에 출력할 설정
        new(winston.transports.Console)({
            name : 'debug-console',
            colorize : true,
            level : log_config.log.debug.level
        }),
        new(winstonDaily)({})

    ],
    //치명적인 에러가 발생한 경우 상세 정보를 
    //강제로 별도의 파일에 기록하기 위함 
    exceptionHandlers : [

    ]
});


// const logger = winston.createLogger({
//     levels : {error : 5,
//         warn : 4,
//         info : 3,
//         debug : 2,
//         sql : 1,
//         verbose : 0}
//     });
// winston.level = 'debug';

// logger.error();

//마지막 상용화 버전 
if(process.env.NODE_ENV !== 'production'){
    logger.add(new winston.transports.Console({
        format : winston.format.combile(
            winston.format.colorize(),
            winston.format.simple()
        )
    }))
}