# web parameter
#### nest.js 라는게 치고 올라온다네요 typescript 도 공부하고 싶다 

#### app.use
    - 이걸 통해 불러오는 것들은 보통 미들웨어라고 불린다. 

## #01. 웹 파라미너 전송방식
### 1. GET
    - 모든 변수 노출 ?test1=100&test2=200
### 2. POST
    - <form method="post"> 
    - body-parser 있어야 함 
### 3. put, delete

### 4. URL params
    - http://hostname:port/페이지이름/변수1/변수2

data = {a:100, b:200}

for(k in data){
    k에 a, b, 의 값들이 나온다 
}


https://tv.naver.com/v/23324345
-> url 파라미터 



### npm method-override 

## #02. Restful 
하나의 URL이 어떤 개체를 의미하고 전송방식에 따라 조회, 입력, 수정, 삭제 구분하는 구현형태 
대부분의 openAPI 들이 그러함 