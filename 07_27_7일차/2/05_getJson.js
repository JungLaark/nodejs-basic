//다소 복잡한 json
const axios = require('axios');

const address = 'http://itpaper.co.kr/demo/covid19/now.php';

(async () => {
    try{
        const response = await axios.get(address);

        response.data.state.forEach((v, i) => {
            const confirm = v.confirmed - v.confirmed_prev;
            console.log("[" + v.region + "]");
            console.log("확진자 : " + confirm);
        });

    }catch(error){
        console.log(error);
    }
})();

//자존심 부리지 말자 ㅎㅎㅎ 쓸때없는 자존심이다 