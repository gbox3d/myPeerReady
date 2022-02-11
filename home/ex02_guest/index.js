// import Peer from 'peerjs';

async function main() {

    let remotePeerConnection = null;
    const localId = document.getElementById('localId');
    const remoteId = document.getElementById('remoteId');
    const msgInput = document.getElementById('msg');
    let lastPeerId = null;

    const option = {
        host: 'cam2us.ubiqos.co.kr',
        port: 9000,
        path: '/peerjs/myapp',
    }
    const peer = new Peer(option);

    peer.on('open', function (id) {
        // Workaround for peer.reconnect deleting previous id
        if (peer.id === null) {
            console.log('Received null id from peer open');
            peer.id = lastPeerId;
        } else {
            lastPeerId = peer.id;
        }

        console.log('ID: ' + peer.id);
    });
    peer.on('connection', function (c) {
        // Disallow incoming connections
        c.on('open', function () {
            c.send("Sender does not accept incoming connections");
            setTimeout(function () { c.close(); }, 500);
        });
    });
    peer.on('disconnected', function () {

        console.log('Connection lost. Please reconnect');

        // // Workaround for peer.reconnect deleting previous id
        // peer.id = lastPeerId;
        // peer._lastServerId = lastPeerId;
        // peer.reconnect();
    });
    peer.on('close', function () {
        remotePeerConnection = null;

        console.log('Connection destroyed');
    });
    peer.on('error', function (err) {
        console.log(err);
        alert('' + err);
    });



    document.querySelector('#connectBtn').addEventListener('click', () => {

        console.log(`connect to ${remoteId.value}`);

        // Close old connection
        if (remotePeerConnection) {
            remotePeerConnection.close();
        }

        // Create connection to destination peer specified in the input field
        remotePeerConnection = peer.connect(remoteId.value, {
            reliable: true
        });

        remotePeerConnection.on('data', function (data) {
            console.log(data)
            remotePeerConnection.send('echo: ' + data);
        });

        remotePeerConnection.on('open', function () {
            console.log("Connected to: " + remotePeerConnection.peer);
        });
        // Handle incoming data (messages only since this is the signal sender)
        
        remotePeerConnection.on('close', function () {
            console.log(`closed`)

        });

    });

    document.querySelector('#sendTestBtn').addEventListener('click', () => {
        const msg = msgInput.value;
        if (remotePeerConnection) {
            console.log(`send msg : ${msg}`);
            remotePeerConnection.send(msg);
        }
    });
}

export default main;