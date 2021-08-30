# Cookies, Session 

## Cookies
    - 텍스트 파일에 저장됨
    - 즐겨찾기 등 
    - 데이터 조회, 저장할 때 암호화 
    - cookie-parser 설치 
### 관련 라이브러리 설치 
    ```shell
        npm install cookie-parser --save
    ```
### 실습내용 
    - http 에서 axios 로 backend로 데이터를 보내는데 이때 쿠키에 저장 
### 관련 설정들 
    - maxAge 
    - domain
    - httpOnly
    - path : .naver.com 이면 ~.naver.com에서 모두 접근 가능 
    - signed : 암호화 여부 
    

## Session 
    - 