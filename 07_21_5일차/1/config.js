const path = require('path');

module.exports = {
    log : {
        debug : {
            path : path.join(__dirname, '../../log'),
            level : 'debug'
        },
        error : {
            //path : path.join(__dirname, './files/logs'),
            path : path.join(__dirname, '../../log'),
            level : 'error'
        }
    }
};

