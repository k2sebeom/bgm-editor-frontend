import React, { useState } from 'react';
import './App.css'
import { Slider } from '@mui/material';
import { FileUploader } from 'react-drag-drop-files';


function BgmSlider() {
  const [val, setVal] = useState<number[]>([0, 10]);

  return (
    <div style={{
      width: '100%'
    }}>
      <Slider 
        value={val}
        onChange={(e, newVal) => {
          setVal(newVal as number[]);
        }}
        min={0}
        max={50}
      />
      <div className='hstack'>
        <label htmlFor="genre">Genre:</label>
        <select name="genre" id="genre">
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>

        <label htmlFor="mood">Mood:</label>
        <select name="mood" id="mood">
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>

        <button>Search</button>

        <label htmlFor="aclip">Choose a car:</label>
        <select name="aclip" id="cars">
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
      </div>
      
    </div>
  )
}


function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');

  return (
    <div className='container'>
      <FileUploader
        handleChange={(file: File) => {
          const path = URL.createObjectURL(file);
          setVideoUrl(path);
          setVideoFile(file);
        }}
        types={['mp4', 'mov', 'webm']}
      />
      <video src={videoUrl}></video>
      
      <Slider />
      <div className='hstack'>
        <button>Play</button>
        <button>Stop</button>
      </div>

      <BgmSlider />

      <button>New BGM</button>
    </div>
  );
}

export default App;
