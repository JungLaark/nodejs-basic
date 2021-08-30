//은근히 많이 쓰는 것 console.time()
//이 라인이 실행되는 시각을 기록하게 된다.
console.time("s-time");


//react를 공부해야 겠구먼 
//document. , windows. node에서는 못쓴다.
//ctrl+F5 로 실행(디버깅 없이 실행)
console.log("Hello");

//내장 전역변수 사용
console.log("Current file name : " + __filename);
console.log("Current file Path : " + __dirname);

//형식 문자의 사용 %d(정수 실수 포함), %s 
const name = "학생";
const age = 20;
const height = 200.2;

console.log("%s는 %d세이고 키는 %d 입니다.", name, age, height );


//json 데이터 출력하기 
const data = {
    name : "학생",
    age : 20,
    height : 200.2
};

console.log("JSON 데이터 : %j", data);

/*s-time 기록을 중단하고 시작시간 부터 이 지점의 실행시간 까지 걸린시간 */
console.timeEnd("s-time");



