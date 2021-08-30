const helloWorld = () => {
    console.log("Hello world");
}

//이 파일 내의 어떤 기능을 이 파일을 참조하는데 다른 대상에게 내보낸다
module.exports = helloWorld;


const niceWorld = function(){
    console.log("nice world");
}

module.exports = niceWorld;

//함수 변수는 타입이 object로 같다. 
//익명함수 

function test(){

}

var a = test;
a();//실행이 됨 


//익명함수 스타일 
const bestWorld = function(){
    console.log("nice world");
}

module.exports = bestWorld;



