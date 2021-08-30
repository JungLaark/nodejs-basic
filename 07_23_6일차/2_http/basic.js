/**
 * simple http client 
 * 외부 사이트의 컨텐츠 가져오기
 */

const logger = require('../../07_21_5일차/1/logHelper');
const http = require('http');//기본 모듈 

const url = 'http://itpaper.co.kr/data/simple_text.txt';
const url = 'http://itpaper.co.kr/data/simple_text.json';

//결과를 callback 함수로 받아옴 
const req = http.get(url, (res) => {
    let resData = '';
    //응답이 오면
    res.on('data', (chunk) => {
        resData += chunk;
    });

    //응답 종료가 되면
    res.on('end', () => {
        logger.debug(resData);
    });
});

// req.on('error', (err) =>{
//     logger.error(error.stateCode + ' ' + err.message);
// })


const j = JSON.parse(resData);
console.log(j.name);