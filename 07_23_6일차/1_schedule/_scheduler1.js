//특정 시간에 한 번만 수행되는 예약 작업 

const logger = require('../../07_21_5일차/1/logHelper');
const dayjs = require('Dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
const schedule = require('node-schedule');

//예약 작업이 실행될 시간 
//timezone, utc 필요 
dayjs.extend(utc);
dayjs.extend(timezone);

const atTime = dayjs();
atTime.tz('Asia/Seoul');


logger.debug('tet');
//5초 후 시각
const afTime = atTime.add(5, 'second');
logger.debug();

//예약 작업 생성 
//js의 date객체를 추출
const jsDate = afTime.toDate();

//스케쥴러 설정 
schedule.scheduleJob(jsDate, () => {
    logger.debug('5초 후 작업이 수행');
});

logger.debug( afTime.format('YYYY-MM-DD HH:mm:ss') + '작업이 예약되었습니다')