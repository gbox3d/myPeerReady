import express from 'express'
import dotenv from "dotenv"
import https from 'https'
import fs from 'fs'
import { PeerServer } from 'peer'
import { ExpressPeerServer } from 'peer'

// console.log(SocketIO_version);
dotenv.config({ path: '.env' }); //환경 변수에 등록 
console.log(`run mode : ${process.env.NODE_ENV}`);

const app = express()


const options = {
    key: fs.readFileSync('/home/ubiqos/work/project/cert_files/2022_2/private.key'),
    cert: fs.readFileSync('/home/ubiqos/work/project/cert_files/2022_2/certificate.crt'),
    ca: fs.readFileSync('/home/ubiqos/work/project/cert_files/2022_2/ca_bundle.crt'),
};
// https 서버를 만들고 실행시킵니다
const httpsServer = https.createServer(options, app)


// const peerServer = PeerServer({
//     port: 9001,
//     path: '/myapp',
//     ssl :{
//         key: fs.readFileSync('/home/ubiqos/work/project/cert_files/2022_2/private.key'),
//   cert: fs.readFileSync('/home/ubiqos/work/project/cert_files/2022_2/certificate.crt'),
//   ca: fs.readFileSync('/home/ubiqos/work/project/cert_files/2022_2/ca_bundle.crt'),

//     }
// });

const peerServer = ExpressPeerServer(httpsServer, {
    debug: true,
    path: '/myapp'
});

app.use('/peerjs', peerServer); // https://cam2us.ubiqos.co.kr:9000/peerjs/myapp 접속확인 요망

app.use('/', express.static(`./home`));
//순서 주의 맨 마지막에 나온다.
app.all('*', (req, res) => {
    res
        .status(404)
        .send('oops! resource not found')
});

httpsServer.listen(process.env.PORT, () => {
    console.log(`server run at : ${process.env.PORT}`)
});

