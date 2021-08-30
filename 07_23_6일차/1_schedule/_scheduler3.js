//Crontab 스타일의 스케쥴러 지정 

//스케쥴에 따른 자동 수행 
//5초 마다 실행하고 싶을 때는? 
const logger = require('../../07_21_5일차/1/logHelper.js');
const schedule = require('node-schedule');

// 매 분 1분 마다 실행
schedule.scheduleJob("* * * * *", 
    () => logger.info('매 분' + rule1.second + '초 마다 실행'));

schedule.scheduleJob(rule1, () => console.log(rule1.second));

// 매 시간 x분 x초 마다 실행 
const rule2 = new schedule.RecurrenceRule();
rule2.minute = 03;
rule2.second = 10;
schedule.scheduleJob(rule2, () => logger.debug('매시간 ' + rule2.minute + '분 ' + rule2.second + '초 마다 수행!!'));


/** (4) 매일 #시#분#초마다 수행 */
const rule3 = new schedule.RecurrenceRule();
rule3.hour = 20;
rule3.minute = 03;
rule3.second = 20;
schedule.scheduleJob(rule3, () => logger.warn('매일 ' + rule3.hour + '시 ' + rule3.minute + '분 ' + rule3.second + '초 마다 수행!!', rule3.hour, rule3.minute, rule3.second));

/** 일주일 중 0요일을 기준으로 1번째~5번째 요일까지 (0=sun,6=sat) */
const rule4 = new schedule.RecurrenceRule();
//배열을 넣는다>? 
rule4.dayOfWeek = [0, new schedule.Range(1, 5)];
rule4.second = 45;
schedule.scheduleJob(rule4, () => logger.debug('매주 월~금 매 분 45초마다 실행'));
//

logger.error("예약작업이 설정되었습니다.");