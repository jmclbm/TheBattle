const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let villages = {};

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);
    
    villages[socket.id] = { resources: { wood: 100, stone: 100, food: 100 }, military: { tanks: 2, airplanes: 1 } };
    socket.emit('villageData', villages[socket.id]);

    socket.on('gatherResources', () => {
        let village = villages[socket.id];
        if (village) {
            village.resources.wood += 10;
            village.resources.stone += 10;
            village.resources.food += 10;
            socket.emit('villageData', village);
        }
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        delete villages[socket.id];
    });
});

server.listen(3000, () => console.log('Server running on port 3000'));
