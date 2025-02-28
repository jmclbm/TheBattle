import React, { useEffect, useState } from 'react';
import { io as socketClient } from 'socket.io-client';
import './App.css';

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

    const trainTank = () => {
        socket.emit('trainTank');
    };

    const trainAirplane = () => {
        socket.emit('trainAirplane');
    };

    return (
        <div className="container">
            <h1>The Battle - My Village</h1>
            <div className="resources">
                <div className="resource">
                    <h3>Wood</h3>
                    <p>{village.resources.wood}</p>
                </div>
                <div className="resource">
                    <h3>Stone</h3>
                    <p>{village.resources.stone}</p>
                </div>
                <div className="resource">
                    <h3>Food</h3>
                    <p>{village.resources.food}</p>
                </div>
            </div>
            <div className="military">
                <div className="unit">
                    <h3>Tanks</h3>
                    <p>{village.military.tanks}</p>
                </div>
                <div className="unit">
                    <h3>Airplanes</h3>
                    <p>{village.military.airplanes}</p>
                </div>
            </div>
            <div className="actions">
                <button onClick={gatherResources}>Gather Resources</button>
                <button onClick={trainTank}>Train Tank</button>
                <button onClick={trainAirplane}>Train Airplane</button>
            </div>
        </div>
    );
}

export default App;
