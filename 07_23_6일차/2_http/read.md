# HTTP Client 

url을 통해 다른 웹 컨텐츠 가져오는 기술 
  - url이 text, xml, json 인 경우 원본 내용만 가져옴 
  - XMLHttpRequest 클래스를 통해 구현 -> ajax 

    -> explore 제외 
  document.getElementById("hello").addEventListenner("click", function(){

  })
-> explore 에서만 
  document.getElementById("hello").attachEvent("clcik", function(){

  })

  --> jquery 
# Frontend 
  - 바닐라스크립트? 순정 js을 써라
  - XMLHttpRequest 
  - CORS-> 도메인이 달라지면 안됨 

# Backend 
 - socket을 사용하기때문에 어떤 도메인이든 접근 가능 
 - 다른 도메인으로 접근이 가능하다. content를 가져오는게 됨 

 # Proxy
  프론트엔드 - 백엔드 - 다른 url 


  시스템이 견고하지 못하다 대용량 시스템을 커버 


ajax의 목적 -> crud 
