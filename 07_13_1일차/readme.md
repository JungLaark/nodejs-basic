# Node.js 1일차

Node.는 기본적으로 웹 페이지 작성 시 사용하던 javascript 언어.
    - 단, window 객체나 document 객체처럼 브라우저의 
     기능을 사용하는 객체는 사용 불가.

## 내장객체

javascript 내장 객체인 console은 출력을 담당.
```js
console.log(문자열 형태의 내용)
```
내용으로 출력할 문자열에 형식문자를 지정하여 치환할 수 있다.

```js
console.log("%d, %s, %j");
```
<pre>
    <code>
        //json 데이터 출력하기 
        const data = {
            name : "학생",
            age : 20,
            height : 200.2
        };

        console.log("JSON 데이터 : %j", data);
    </code>
</pre>
***
## 실행시간 측정 
<pre>
    <code>
        console.time('시점이름');

        console.timeEnd('시점이름');
    </code>
</pre>
***
## 모듈 

<pre>
    <code>
        module.exports = bestWorld;
    </code>
</pre>

<pre>
    <code>
        //경로는 반드시 상대경로 
        const test = reqire('호출할 js파일명');
        test();
    </code>
</pre>
***


