const http = require('http');
const cluster = require('cluster');

const log = console.log;
const cpus = require('os').cpus();
const cpuLen = cpus.length;
const port = 3000;

// log(cpus, cpuLen);
if (cluster.isMaster) {
    for (let i = 0; i < cpuLen; i++) {
        cluster.fork();
        cluster.on('exit', (worker, code, signal) => { // 클러스터가 죽으면
            console.log(worker.process.pid); // process id
            cluster.fork(); // 클러스터가 죽으면 다른 클러스터 생성
        });
    }
} else { // 맨처음 아래 문장이 실행됨?? 아닌듯
    http.createServer((req, res) => {
        console.log(process.pid + " CPU run");
        res.end(`${process.pid} reponse`);
    }).listen(port);
    console.log('pid', process.pid);
}

// 멀티 프로세스? pm2 모듈이 대신해줌

// 실무에서 node 서버로 바로 돌리진 않는다.
// nginx로 호스팅 서버를 돌린다.
