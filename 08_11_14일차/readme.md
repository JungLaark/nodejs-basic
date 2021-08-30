# 파일 접근 권한 
    - static(public_path) 로 설정하여 웹에 노출시킴 
```javascript
 const public_path = path.join(__dirname, '../public');
 //이거는 ex1/~.html 이런 식으로 
```

# Thumbnail 
    - 현재 http://localhost:3000/08_10_upload/api.html 를 통한 파일 업로드시의 이미지 보이는 것은 용량이 너무 크다.
```bash
- npm install node-thumbnail --save
```
    - 저장할 사이즈, 원본의 경로(req.file.path) 
```html
<img srcset="">
```
    