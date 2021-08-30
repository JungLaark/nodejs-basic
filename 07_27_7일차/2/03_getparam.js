const axios = require('axios');

(async () => {
    try{
        const resp = await axios.get('http://itpaper.co.kr/data/get.php', {
            params: {
                num1: 200,
                num2: 800
            }
        });
        console.log(resp.data);
    }catch(error){
        const errorMsg = "[" + error.resp.status ;
        console.log(errorMsg);
    }
})();


//내 프로젝트 - html,backend(proxy:경유지)
