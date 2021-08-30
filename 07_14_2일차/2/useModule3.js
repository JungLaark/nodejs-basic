//Prototype형 클래스를 참조 
const myProto = require('./myModule3');

//클래스는 new 키워드로 다른 변수에게 부여해야 한다. 
const myObj = new myProto();
myObj.say();

//es