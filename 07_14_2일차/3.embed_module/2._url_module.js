const url = require('url');

const current = url.parse('http://www.itpaper.co.kr:8765/hello/world.html');

console.log('href : ' + current.href);//
console.log('href : ' + current.protocol);//통신방식
console.log('href : ' + current.port);
console.log('href : ' + current.host);//사이트 주소
console.log('href : ' + current.hostname);//포트번호를 제외한 값
console.log('href : ' + current.path);//사이트 이후의 값 #부분 제외
console.log('href : ' + current.pathname);//사이트 주소에서 변수 영역 제외한 값 
console.log('href : ' + current.search);//?를 포함한 변수 영역
console.log('href : ' + current.query);//search에서 ? 제외
console.log('href : ' + current.hash);//#와 함께 표시되는 마지막 값 

const info = {
    protocol: 'http:',
	hostname: 'www.itpaper.co.kr',
	port: '8080',
	pathname: '/hello/world.html',
	search: '?name=nodejs&age=10',
	hash: '#target'
}

const urlString = url.format(info);