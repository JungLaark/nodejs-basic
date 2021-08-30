# Scheduler

## Batch Process 

 - 흐름에 따라 순차적으로 자료를 처리하는 프로그램
 - ex> 특정 기간 이후 특정 파일 삭제

 ## 구현 방법 

 ### 패키지 설치
 
 ```shell
 npm install --save node-schedule
 ```

 const schedule = require('node-schedule');
 schedule.scheduleJob(특정시각|시간규칙, function(){
     수행할 기능 
 });

 ## 실행 환경 다시 
 code runner 설치 
 run in terminal ctl+alt+n

 ## Crontab 표현식 
  - 리눅스나 mac에서 자체적으로 쓰는 스케쥴러  

