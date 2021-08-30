/**
 * 현재 시스템의 IP주소를 조회하여 배열로 리턴한다.
 * @return {Array}   
 */
 const os = require('os');

 module.exports.myip = function() {
     var ip_address = [];
     var nets = os.networkInterfaces();
 
     for (var attr in nets) {
         var item = nets[attr];
         for (var j=0; j<item.length; j++) {
             // 주소형식이 IPv4이면서 로컬아이피가 아닌 경우
             if (item[j].family == 'IPv4' && item[j].address != '127.0.0.1') {
                 ip_address.push(item[j].address);
             }
         }
     }
 
     return ip_address;
 };