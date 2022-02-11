// import Peer from 'peerjs';

async function main() {

    let remotePeerConnection = null;
    const localId = document.getElementById('localId');
    const msgInput = document.getElementById('msg');
    
    const option = {
        host: 'cam2us.ubiqos.co.kr',
        port: 9000,
        path: '/peerjs/myapp',
    }

    const peer = new Peer(option);
    peer.on('open', function (id) {
        console.log('My peer ID is: ' + id);
        localId.innerText = id;

    });
    peer.on('connection', function (conn) {
        console.log('remote peer connection', conn);

        conn.on('data', function (data) {
            console.log(data)
        });
        
        remotePeerConnection = conn;

    });
    peer.on('disconnected', function () {
        
        console.log('Connection lost. Please reconnect');
        // // Workaround for peer.reconnect deleting previous id
        // peer.id = lastPeerId;
        // peer._lastServerId = lastPeerId;
        // peer.reconnect();
    });
    peer.on('close', function() {
        conn = null;
        console.log('Connection destroyed');
    });
    peer.on('error', function (err) {
        console.log(err);
        alert('' + err);
    });

    document.querySelector('#sendTestBtn').addEventListener('click', () => {
        const msg = msgInput.value;
        if(remotePeerConnection){
            console.log(`send msg : ${msg}`);
            remotePeerConnection.send(msg);
        }
    });
}

export default main;