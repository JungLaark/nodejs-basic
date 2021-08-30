const queryString = require('querystring');
const url = require('url');

//url의 쿼리부분만 추출하기 
const address = 'http://www.itpaper.co.kr/hello/world.html?a=123&b=456';
const current = url.parse(address);
const query = current.query;

//요청 파라미터를 json 객체로 변환 
const param = queryString.parse(query);
console.log('요청 파라미터 중 a의 값 : %s', param.a);
console.log('요청 파라미터 중 b의 값 : %s', param.b);

//json 객체를 querystring 문자열로 변환 
const obj = {
    "name" : "hello",
    "nick" : "world"
}

const str = queryString.stringify(obj);
console.log(str);
