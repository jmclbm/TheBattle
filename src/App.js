import React, { useEffect, useState } from 'react';
import { io as socketClient } from 'socket.io-client';

const socket = socketClient("https://your-backend-url"); // Replace with your Render backend URL

function App() {
    const [village, setVillage] = useState({ 
        resources: { wood: 0, stone: 0, food: 0 }, 
        military: { tanks: 0, airplanes: 0 } 
    });

    useEffect(() => {
        socket.on('villageData', (data) => {
            setVillage(data);
        });

        return () => {
            socket.off('villageData');
        };
    }, []);

    const gatherResources = () => {
        socket.emit('gatherResources');
    };

    return (
        <div>
            <h1>The Battle - My Village</h1>
            <p>Wood: {village.resources.wood}</p>
            <p>Stone: {village.resources.stone}</p>
            <p>Food: {village.resources.food}</p>
            <p>Tanks: {village.military.tanks}</p>
            <p>Airplanes: {village.military.airplanes}</p>
            <button onClick={gatherResources}>Gather Resources</button>
        </div>
    );
}

export default App;
