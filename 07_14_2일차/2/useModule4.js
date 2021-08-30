//Prototype형 클래스를 참조 
const myProto = require('./myModule4');

const myObj = new myProto;
myObj.say();
//es6 서타일 


//set get 함수 호출 
//변수 일 수 도 있고 함수일 수도 있다 
console.log(myObj.age);
myObj.age = 100;

//Math, Date(Day.js), JSON 내장 함수 