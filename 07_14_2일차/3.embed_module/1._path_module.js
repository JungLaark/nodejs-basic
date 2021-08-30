//이제 한시간 남았다 
const path = require('path');

const currentPath = path.join('/User/hello/world', '../photo.jpg');
console.log('%s', currentPath);

const dirname = path.dirname(currentPath);
const basename = path.basename(currentPath);
const extname = path.extname(currentPath);

const parse = path.parse(currentPath);
console.log(parse.root);
console.log(parse.dir);
console.log(parse.name);
console.log(parse.ext);

//집에 가고 시프네

