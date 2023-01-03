import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css'
import { Slider } from '@mui/material';
import { FileUploader } from 'react-drag-drop-files';
import { BASE_URL, fetchMetrics, fetchSongs } from './api';


type Bgm = {
  range: number[];
  genre: string;
  mood: string;
  clipId?: number;
  songs: Song[];
}

type BgmSliderProps = {
  bgm: Bgm;
  onRemove: () => void;
  onChange: (bgm: Bgm) => void;
  duration: number;
  metrics: any;
}

type Song = {
  id: number;
  title: string;
  artist: string;
  url: string;
}

function BgmSlider({bgm, onChange, onRemove, duration, metrics}: BgmSliderProps) {
  const [audioUrl, setAudioUrl] = useState<string>('');

  return (
    <div style={{
      width: '100%'
    }}>
      <Slider
        value={bgm.range}
        onChange={(e, newVal) => {
          const newBgm = { ...bgm };
          newBgm.range = newVal as number[];
          onChange(newBgm);
        }}
        min={0}
        max={duration}
        step={0.01}
      />
      <div className='hstack'>
        <label htmlFor="genre">Genre:</label>
        <select name="genre" id="genre" value={bgm.genre} onChange={(e) => {
          const newBgm = { ...bgm };
          newBgm.genre = e.target.value;
          onChange(newBgm);
        }}>
          {
            metrics.genre.map((g: any) => {
              return <option key={`genre-${g}`} value={g}>{g}</option>
            })
          }
        </select>

        <label htmlFor="mood">Mood:</label>
        <select name="mood" id="mood" value={bgm.mood} onChange={(e) => {
          const newBgm = { ...bgm };
          newBgm.mood = e.target.value;
          onChange(newBgm);
        }}>
          {
            metrics.mood.map((m: any) => {
              return <option key={`mood-${m}`} value={m}>{m}</option>
            })
          }
        </select>

        <button
          onClick={async () => {
            const resp = await fetchSongs(bgm.mood, bgm.genre);
            const newBgm = { ...bgm };
            newBgm.songs = resp.data;
            newBgm.clipId = newBgm.songs[0].id;
            onChange(newBgm);
            setAudioUrl(BASE_URL + newBgm.songs[0].url);
          }}
        >Search</button>

        <label htmlFor="aclip">Choose a car:</label>
        <select name="aclip" id="aclip" value={bgm.clipId} onChange={(e) => {
          const newBgm = { ...bgm };
          const index = parseInt(e.target.value);
          newBgm.clipId = bgm.songs[index].id;
          console.log(bgm.songs[index])
          setAudioUrl(BASE_URL + bgm.songs[index].url);
          onChange(newBgm);
        }}>
          {
            bgm.songs.map((s: any, i: number) => {
              return <option key={`clip-${s.title}`} value={i}>{s.title} by {s.artist}</option>
            })
          }
        </select>
        <audio src={audioUrl} controls></audio>
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

  const [metrics, setMetrics] = useState<any>({ genre: [], mood: []});

  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const [bgms, setBgms] = useState<Bgm[]>([]);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    fetchMetrics().then((data) => {
      setMetrics(data.data);
    })
  }, []);

  const handleBgmUpdate = useCallback((bgm: Bgm, index: number) => {
    setBgms((prev: Bgm[]) => {
      const newBgm = [...prev];
      newBgm[index] = bgm;
      return newBgm;
    })
  }, [setBgms]);

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
              bgm={bgm}
              metrics={metrics}
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
              onChange={(bgm: Bgm) => {
                handleBgmUpdate(bgm, i);
              }}
            />
          )
        })
      }

      <button onClick={() => {
        setBgms((prev: Bgm[]) => {
          const newBgm = [...prev, { range: [0, 0], genre: metrics.genre[0], mood: metrics.mood[0], songs: [] }];
          return newBgm;
        })
      }}>New BGM</button>
    </div>
  );
}

export default App;
