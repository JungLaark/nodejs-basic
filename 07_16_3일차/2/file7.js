var fileHelper = require('../helper/file_helper.js');
var path = require('path');

// 상대경로 방식으로 폴더 생성하기
var target1 = "./test/dir/make";
fileHelper.mkdirs(target1);

// 절대경로 방식으로 폴더 생성하기
var target2 = path.join(__dirname, 'hello/node/js');
fileHelper.mkdirs(target2);