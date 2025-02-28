import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './App.css';

const socket = socketClient("https://your-backend-url"); // Replace with your Render backend URL

const Model = ({ path }) => {
    const ref = useRef();
    const [model, setModel] = useState();

    useEffect(() => {
        new GLTFLoader().load(path, setModel);
    }, [path]);

    useFrame((state, delta) => (ref.current.rotation.y += 0.01));

    return model ? <primitive object={model.scene} ref={ref} /> : null;
};

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
            <div className="header">
                <h1>The Battle - My Village</h1>
            </div>
            <div className="section">
                <div className="card">
                    <Canvas>
                        <Model path="/assets/wood.glb" />
                    </Canvas>
                    <h3>Wood</h3>
                    <p>{village.resources.wood}</p>
                </div>
                <div className="card">
                    <Canvas>
                        <Model path="/assets/stone.glb" />
                    </Canvas>
                    <h3>Stone</h3>
                    <p>{village.resources.stone}</p>
                </div>
                <div className="card">
                    <Canvas>
                        <Model path="/assets/food.glb" />
                    </Canvas>
                    <h3>Food</h3>
                    <p>{village.resources.food}</p>
                </div>
            </div>
            <div className="section">
                <div className="card">
                    <Canvas>
                        <Model path="/assets/tank.glb" />
                    </Canvas>
                    <h3>Tanks</h3>
                    <p>{village.military.tanks}</p>
                </div>
                <div className="card">
                    <Canvas>
                        <Model path="/assets/airplane.glb" />
                    </Canvas>
                    <h3>Airplanes</h3>
                    <p>{village.military.airplanes}</p>
                </div>
            </div>
            <div className="section">
                <button onClick={gatherResources}>Gather Resources</button>
                <button onClick={trainTank}>Train Tank</button>
                <button onClick={trainAirplane}>Train Airplane</button>
            </div>
        </div>
    );
}

export default App;
