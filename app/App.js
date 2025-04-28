'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';


function RotatingEarth({ texture, isRotating }) {
  const earthRef = useRef();
  useFrame(() => {
    if (earthRef.current && isRotating) {
      earthRef.current.rotation.y += 0.0003;
    }
  });
  return (
    <mesh ref={earthRef} rotation={[0, 30, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function StaticDirectionalLight() {
  const { camera } = useThree();
  const lightRef = useRef();
  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.copy(camera.position);
    }
  });
  return <directionalLight ref={lightRef} intensity={1} />;
}

function EarthVisualization() {

  const [fields, setFields] = useState(['u', 'v', 't', 'q']);
  const [maxSteps, setMaxSteps] = useState(29);
  const [prefix, setPrefix] = useState('gencast-1.0');
  const [levels, setLevels] = useState([3]);

  const fileInputRef = useRef();
  const [selectedField, setSelectedField] = useState('u');
  const [selectedLevel, setSelectedLevel] = useState('3');
  const [selectedStep, setSelectedStep] = useState(0);
  const [texture, setTexture] = useState(null);
  const [isRotating, setIsRotating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(150);
  const defaultTexture = null;

  useEffect(() => {
    const fetchTexture = async () => {
      try {
        const stepStr = String(selectedStep).padStart(2, '0');
        const stepLvl = String(selectedLevel).padStart(2, '0');
        const url = `${prefix}/${selectedField}_${stepStr}_${stepLvl}.jpg`;
        const fieldTexture = await new TextureLoader().loadAsync(url);
        setTexture(fieldTexture);
      } catch (error) {
        console.error('Error loading texture:', error);
        setTexture(defaultTexture);
      }
    };
    fetchTexture();
  }, [selectedField, selectedStep, selectedLevel]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setSelectedStep((prev) => (prev + 1) % (maxSteps + 1));
      }, playSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed]);

  const handleFileLoad = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.prefix) setPrefix(data.prefix);
        if (data.fields) setFields(data.fields);
        if (data.levels) setLevels(data.levels);
        if (data.maxSteps !== undefined) setMaxSteps(data.maxSteps);
        if (data.fields) setSelectedField(data.fields[0]);
        if (data.levels) setSelectedLevel(data.levels[0]);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{
      paddingTop: '20px',
      width: '100%',
      height: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px 20px',
      textAlign: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      border: '1px solid #ddd',
      borderRadius: '5px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ fontSize: '2rem', color: 'white' }}><b>AI Weather Forecast</b></h1>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => fileInputRef.current.click()}
          className="border border-gray-300 text-white px-4 py-2 rounded"
        >
          Load Forecast
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={handleFileLoad}
        />
      </div>


      <div className="flex items-center space-x-2 mt-2 mb-2">
        <label htmlFor="field-select" className="font-bold">Field:</label>
        <select
          id="field-select"
          className="p-2 border border-gray-300 rounded"
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
        >
          {fields.map((field) => (
            <option key={field} value={field}>
              {field.toUpperCase()}
            </option>
          ))}
        </select>

        <label htmlFor="level-select" className="font-bold">Level:</label>
        <select
          id="level-select"
          className="p-2 border border-gray-300 rounded"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="step-slider" className="block font-bold ">Time Step</label>
        <input
          id="step-slider"
          type="range"
          min="0"
          max={maxSteps}
          value={selectedStep}
          onChange={(e) => setSelectedStep(Number(e.target.value))}
          className="w-1/2"
        />

      </div>
      <div className="flex items-center space-x-2 mt-2">
        <label htmlFor="speed" className="block font-bold mb-1">Play Speed:</label>
        <input
          id="speed"
          type="number"
          className="p-2 border border-gray-300 rounded"
          value={playSpeed}
          onChange={(e) => setPlaySpeed(Number(e.target.value))}
          min="100"
        />
        <button
          onClick={() => setIsPlaying((prev) => !prev)}
          className="border border-gray-300 text-white px-4 py-2 rounded"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
      <div className="h-full" style={{ height: '400px' }}>
        <Canvas camera={{ position: [-1, 2.9, 2] }}> [-1, 2.9, 2]
          <ambientLight intensity={0.3} />
          <StaticDirectionalLight />
          <RotatingEarth texture={texture || defaultTexture} isRotating={isRotating} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

    </div>
  );
}

export default EarthVisualization;
