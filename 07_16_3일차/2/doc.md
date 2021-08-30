npm install --save owl.carousel
--> --save 옵션은 사용하는 패키지 정보가 package.json에 저장됨 



npm install -> package.json 에 있는 파일들 설치 
npm init -> 초기화 

나중에 납품할 때는 package.json 만 납품한다. 왜냐면 저작권 문제가 생기기 때문에 
node_modules 파일은 삭제 후 배포 


## 이벤트 리스너
    html > onclick

## 이벤트 핸들러
    html > onclick 에 의해 실행되는 사용자 정의 함수 

## 상속 (ES6)

class Hello{
    say(){

    }
}

class World extends Hello{

    constructor(){
        super();
    }

    talk(){

    }
}

const w = new World();
w.say();
w.talk();

ajax httpclient