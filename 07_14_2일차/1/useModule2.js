//useModule2.js
//확장 모듈 참조하기 
const my = require('./myModule2.js');

console.log(my.name);
console.log(my.test.postcode);
my.test.getAddress();