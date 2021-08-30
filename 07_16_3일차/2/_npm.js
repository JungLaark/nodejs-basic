var nconf = require('nconf');

// 환경 변수에 대한 정보를 가져와서 속성으로 보관
nconf.env();

// 윈도우와 Mac의 환경에 따라서 존재하는 값을 취득
var path = nconf.get("PATH") || nconf.get("Path");
var list = [];
if (path.indexOf(";") > -1) {
	list = path.split(";");		// 윈도우의 경우
} else {
	list = path.split(":");		// Linux,Mac의 경우
}

for (var i=0; i<list.length; i++) {
    if (list[i]) {
        console.log("%d번째 Path: %s", i+1, list[i]);
    }
}