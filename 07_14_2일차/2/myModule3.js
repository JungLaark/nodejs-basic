//ES5 class를 모듈화 하기 

//그냥 익명함수 
const MyClass = function(){
    console.log('---MyClass의 객체가 생성되었습니다. ');
    this.age = 20;
    this.name = '노드';

};

//익명함수 확장 
//익명함수를 프로토타입 속성으로 확장할 경우 
//그 함수는 생성자로 승격된다.
MyClass.prototype.say = function(){
    console.log("내이름은 %s 이고 skdlsms %d", this.name, this.age);

}

module.exports = MyClass;