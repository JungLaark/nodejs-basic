//es6
class MyClassEs6{
    //생성자 함수 만듦
    constructor(){
        console.log('MyClassEs6의 객체가 생성되었습니다.');
        //맴버변수 _underscore 
        this._age = 20;
        this._name = '노드';
    }

    //setter getter 

    set age(k){
        this._age = k;
    }

    get age(){
        return this._age;
    }

    set name(k){
        this._name = k;
    }

    get name(){
        return this._name;
    }

    say(){
        //this.age 는 get age를 호출하는 것이다 
        console.log('내이름은 %s %d', this.age, this.name);
    }
}

module.exports = MyClassEs6;

//react는 웹팩이 자동으로 들어있다 
//es6 -> es5로 변환해준다
