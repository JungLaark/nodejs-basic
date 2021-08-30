const axios = require('axios');

(async () => {
    try{
        const resp = await axios.get('http://itpaper.co.kr/data/grade_card.json');
        console.log(resp.data);
        console.log(resp.data.grade_card[0].이름);
        
        resp.data.grade_card.forEach((v, i) =>{
            console.log(i + "번쨰 항목");
            console.log("이름 : %s, 학년 : %d", v.이름, v.학년);
        })
    }catch(error){
        const errorMsg = "[" + error.resp.status ;
        console.log(errorMsg);
    }
})();


//내 프로젝트 - html,backend(proxy:경유지)
