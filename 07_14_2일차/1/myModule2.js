//myModule2.js
//export 확장
module.exports.name = "노드";
module.exports.property = {id: 'nodejs', type:'javascript'};
module.exports.say = () => {
    console.log("hello world");
};

let a = 123;

//json 형식의 객체 타입 
module.exports.test = {
    postcode : '123445',
    address : '서울시',
    getAddress : function(){
        console.log(this.postcode + "" + this.address);
    }
};

//함수랑 변수는 동일한 종류의 객체 -> 익명함수 -> 화살표 함수 
// module.exports = test 대신에 저렇게 할 수 있다 .