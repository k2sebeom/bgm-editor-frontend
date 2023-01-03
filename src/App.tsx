import React, { useRef, useState } from 'react';
import './App.css'
import { Slider } from '@mui/material';
import { FileUploader } from 'react-drag-drop-files';


type Bgm = {
  start: number;
  end: number;
  clipId?: number;
}

type BgmSliderProps = {
  onRemove: () => void;
  duration: number;
}

function BgmSlider({onRemove, duration}: BgmSliderProps) {
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
        max={duration}
        step={0.01}
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

        <button style={{
          marginLeft: 'auto'
        }}
          onClick={onRemove}
        >Remove</button>
      </div>
      
    </div>
  )
}


function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const [bgms, setBgms] = useState<Bgm[]>([]);
  const [duration, setDuration] = useState<number>(0);

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
      <video
        ref={videoRef}
        src={videoUrl}
        onTimeUpdate={(e) => {
          const videoElement = e.target as HTMLVideoElement;
          setCurrentTime(videoElement.currentTime);
        }}
        onLoadedData={(e) => {
          const videoElement = e.target as HTMLVideoElement;
          setDuration(videoElement.duration);
        }}
      ></video>
      
      <Slider
        min={0}
        max={duration}
        step={0.01}
        value={currentTime}
        onChange={(e, value) => {
          setCurrentTime(value as number);
          if (videoRef.current) {
            videoRef.current.currentTime = value as number;
          }
        }}
      />
      <div className='hstack'>
        <button
          onClick={() => {
            if(videoRef.current !== null) {
              videoRef.current.play();
            }
          }}
        >Play</button>
        <button
          onClick={() => {
            if(videoRef.current !== null) {
              videoRef.current.pause();
            }
          }}
        >Stop</button>
      </div>
      
      {
        bgms.map((bgm: Bgm, i: number) => {
          return (
            <BgmSlider
              key={`bgm-slider-${i}`}
              duration={duration}
              onRemove={() => {
                setBgms((prev: Bgm[]) => {
                  const newBgm = prev.filter((bgm, index) => {
                    return index !== i;
                  });
                  return newBgm;
                })
              }}
            />
          )
        })
      }

      <button onClick={() => {
        setBgms((prev: Bgm[]) => {
          const newBgm = [...prev, { start: 0, end: 0}];
          return newBgm;
        })
      }}>New BGM</button>
    </div>
  );
}

export default App;
