const log = console.log;
const clear = console.clear;

log('__dirname :', __dirname);
log('__filename:', __filename);

console.time("time"); // 인자값으로 시간측정 구간 식별
for (let i = 0; i < 100000000; i++);
console.timeEnd("time");

const obj = {
    name: 'hong',
    summary: {
        age: 25,
        gender: 'M'
    }
};

log(obj);
// console.dir(obj);

// setInterval(()=>{}, 1000);
// setImmediate(()=>{}); // 즉시 실행, 큐에 들어감
// setTimeout(()=>{}, 0); // 즉시 실행, 위와 같음
// setImmediate(clear);

const os = require('os');
log(os.arch());
log(os.platform());
log(os.type());
log(os.uptime());
log(os.hostname());
log(os.release());

// path
log(os.homedir());
log(os.tmpdir());

// CPU
log(os.cpus());
log(os.cpus().length); // 4: quad-core
// 특정 CPU에 앱띄위기 가능, CPU ID로 식별

// Memory
log(os.freemem());
log(os.totalmem());

// path
const path = require('path');
let file = __filename;
log('dirname: ' + path.dirname(file));
log('extname: ' + path.extname(file));
log('basename: ' + path.basename(file));
log(path.parse(file));
log(path.normalize("c:\\\\Users\\hi"));
let dir = path.join(__dirname, '../../../');
log(dir);

clear();

// URL
// https://nodejs.org/api/url.html
const url = require('url');
const querystring = require('querystring');
let myURL = new URL("https://user:1234@www.nodejs.org:2020/api/url/?q=str&num=10#hash");
log(myURL);
log(url.format(myURL));
log(myURL.searchParams);

myURL.searchParams.append('test', '0000');
log(myURL);
log(myURL.searchParams);
