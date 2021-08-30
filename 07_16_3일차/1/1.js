const os = require('os');

module.exports.myip = function(){
    const ip_address = [];
    const nets = os.networkInterface();

    for(var attr in nets){
        var item = nets[attr];

        for(var j=0 ; j<item.length; j++){
            if(item[j].family == 'IPv4' && item[j].address != '127.0.0.1'){
                ip_address.push(item[j].address);
            }
        }
    }

    return ip_address;
};