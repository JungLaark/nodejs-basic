const axios = require('axios');

const url = "http://itpaper.co.kr/data/simple_text.txt";

//메서드 체인으로 몇개를 연결한다.
//이걸 promise 방법이라고 한다. 
//방법 1
axios.get(url)
    .then(function(res){
        //지정된 url의 컨텐츠를 성공적으로 가져온 경우 호출
        
        console.log(res);
    })
    .catch(function(error){
        //실패 할 경우
        //200 ok
        //404 page not found
        //401 permmition
        //403 접근 금지
        //50x 접속 대상 즉 접속하려고 하는 대상에서 나는 오류 
        const errorMsg = "[" + error.response.status + "] " + error.response.statusText;
        console.log(errorMsg);
        console.log(error);
    })
    .then(function(){
        //성공 실패 상관없이 실행 호출됨 
        console.log('마지막 then');
    });

    //비동기라서 이게 먼저 실행됨 
console.log('promise');

//async, await 방식
//방법 2
async function get_sample(){
    try{
        const resp = await axios.get(url);
        console.log("두번째 방식 : " + resp);
    }catch(error){

    }
}

//함수 호출
get_sample();

//방법 3
//즉시 실행으로 변경 -> 함수 이름만 빼줬음 
(async function(){
    try{
        const resp = await axios.get(url);
        console.log("세번째 방식 : " + resp);
    }catch(error){

    }
})();

//방법 4
//즉시 실행으로 변경 -> 함수 이름이랑 빼줬음 마지막에 괄호 추가
(async () => {
    try{
        const resp = await axios.get(url);
        console.log("네번쨰 방식 : " + resp);
    }catch(error){

    }
})();

// 둘 다 axios 를 쓰고 있네 ㅋㅋㅋㅋ 
//좀 더 callback 함수를 줄이려고 async await를 추가한거다 