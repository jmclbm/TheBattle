const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let villages = {};

const generateResources = () => {
    for (let id in villages) {
        let village = villages[id];
        if (village) {
            village.resources.wood += 1;
            village.resources.stone += 1;
            village.resources.food += 1;
            io.to(id).emit('villageData', village);
        }
    }
};

setInterval(generateResources, 60000); // Generate resources every minute

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

    socket.on('trainTank', () => {
        let village = villages[socket.id];
        if (village && village.resources.wood >= 50 && village.resources.stone >= 30) {
            village.resources.wood -= 50;
            village.resources.stone -= 30;
            village.military.tanks += 1;
            socket.emit('villageData', village);
        }
    });

    socket.on('trainAirplane', () => {
        let village = villages[socket.id];
        if (village && village.resources.wood >= 60 && village.resources.stone >= 40) {
            village.resources.wood -= 60;
            village.resources.stone -= 40;
            village.military.airplanes += 1;
            socket.emit('villageData', village);
        }
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        delete villages[socket.id];
    });
});

server.listen(3000, () => console.log('Server running on port 3000'));
