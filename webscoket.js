const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080});

wss.on('connection', ws => {
    console.log('Client verbunden');

    ws.on('message', message => {
        console.log('Nachricht empfangen:');
        console.log(message.toString());
    });

    ws.on('close', () => {
        console.log('Client getrennt');
    });
});

console.log('WebSocket-Server läuft auf ws://localhost:8080');
