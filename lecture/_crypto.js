const log = console.log;
const crypto = require('crypto'); // sha256 뚤림, sha512로 해야함
var sha512 = crypto.createHash('sha512').update("1234").digest("base64"); // 단방향 암호화
log(sha512);

// salt, 해킹방지용 ... 비밀번호에 특정문자 추가해서 암호화
var salt = "ABCD"
var pass = '1234' + salt;
var sha512 = crypto.createHash('sha512').update(pass).digest("base64"); // 단방향 암호화

// 반복 암호화?
crypto.pbkdf2('1234', salt, 10000, 64, 'sha512', (err, key) => {
    console.log(key);
    console.log(key.toString('base64'));
});

// 프로미스화
const util = require('util');
const pbkdf2Promise = util.promisify(crypto.pbkdf2);
(async () => {
    console.time('cypto');
    let key = await pbkdf2Promise('1234', salt, 100000, 64, 'sha512');
    console.timeEnd('cypto');
    log(key.toString('base64'));
})();


///////////
// cipher
// 암호화
const crypto = require('crypto');
const cipher = crypto.createCipher('aes-256-cbc', 'my-key');
let result = cipher.update('school bell ring ring ring', 'utf-8', 'base64');
result += cipher.final("base64");
log(result);

// 복호화
const decipher = crypto.createDecipher('aes-256-cbc', 'my-key');
let result2 = decipher.update(result, 'base64', 'utf-8');
result2 += decipher.final('utf-8');
log(result2);



const fs = require('fs');
let txt = 'school bell ring ring ring';
// fs.writeFile('./readme.txt', txt, (err) => {
//     if (err) console.error(err);
//     else log('success');
// });

fs.writeFileSync('./readme.txt', txt);
let result = fs.readFileSync('./readme.txt'); // result is buffer type
log(result.toString());