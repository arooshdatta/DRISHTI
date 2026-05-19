import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import frame1 from '../assets/frame1.png';
import frame2 from '../assets/frame2.png';
import frame3 from '../assets/frame3.png';
import frame4 from '../assets/frame4.png';
import frame5 from '../assets/frame5.png';
import frame6 from '../assets/frame6.png';
import frame7 from '../assets/frame7.png';

const FRAMES = [
  { id: 1, src: frame1, name: 'Cyberpunk Vision' },
  { id: 2, src: frame2, name: 'Neo Aviator' },
  { id: 3, src: frame3, name: 'Hex Shield' },
  { id: 4, src: frame4, name: 'Void Goggles' },
  { id: 5, src: frame5, name: 'Retro Wire' },
  { id: 6, src: frame6, name: 'Onyx Shade' },
  { id: 7, src: frame7, name: 'Quantum Visor' },
];

export default function VirtualMirror() {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const [activeFrameId, setActiveFrameId] = useState(1);
  const [scaleDisplay, setScaleDisplay] = useState(1.0);
  const [yOffset, setYOffset] = useState(0);
  const activeImageRef = useRef(null);
  const loadedImagesRef = useRef({});
  const scaleMultiplierRef = useRef(1.0);
  const yOffsetRef = useRef(0);

  const adjustScale = (delta) => {
    const newVal = Math.max(0.5, Math.min(2.5, scaleMultiplierRef.current + delta));
    scaleMultiplierRef.current = newVal;
    setScaleDisplay(newVal);
  };

  const adjustVerticalPosition = (delta) => {
    const newVal = Math.max(-50, Math.min(50, yOffsetRef.current + delta));
    yOffsetRef.current = newVal;
    setYOffset(newVal);
  };

  // Preload images
  useEffect(() => {
    FRAMES.forEach(frame => {
      const img = new Image();
      img.src = frame.src;
      img.onload = () => {
        loadedImagesRef.current[frame.id] = img;
        if (frame.id === activeFrameId) {
          activeImageRef.current = img;
        }
      };
    });
  }, []);

  // Update active image ref when state changes
  useEffect(() => {
    if (loadedImagesRef.current[activeFrameId]) {
      activeImageRef.current = loadedImagesRef.current[activeFrameId];
    }
  }, [activeFrameId]);

  // Keyboard navigation for frames
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setActiveFrameId((prev) => {
          const currentIndex = FRAMES.findIndex(f => f.id === prev);
          const nextIndex = (currentIndex + 1) % FRAMES.length;
          return FRAMES[nextIndex].id;
        });
      } else if (e.key === 'ArrowLeft') {
        setActiveFrameId((prev) => {
          const currentIndex = FRAMES.findIndex(f => f.id === prev);
          const nextIndex = (currentIndex - 1 + FRAMES.length) % FRAMES.length;
          return FRAMES[nextIndex].id;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    setIsInitializing(true);
    
    const faceMesh = new window.FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    faceMesh.onResults((results) => {
      const canvas = canvasRef.current;
      if (!canvas || !results.image) return;
      
      const ctx = canvas.getContext('2d');
      // Set canvas to precisely match video dimensions
      canvas.width = results.image.width || 640;
      canvas.height = results.image.height || 480;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Mirror the canvas context horizontally so the webcam looks like a real mirror
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      
      // Draw raw video frame
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      // Draw AR overlay glasses
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        
        // MediaPipe FaceMesh keypoints: Left Eye (159), Right Eye (386), Nose Bridge (168)
        const leftEye = landmarks[159];
        const rightEye = landmarks[386];
        const noseBridge = landmarks[168];

        const lx = leftEye.x * canvas.width;
        const ly = leftEye.y * canvas.height;
        const rx = rightEye.x * canvas.width;
        const ry = rightEye.y * canvas.height;

        const dx = rx - lx;
        const dy = ry - ly;
        const angle = Math.atan2(dy, dx);
        
        // Calculate distance between the eyes
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Scale the glasses relative to the eye distance
        const glassesWidth = dist * 4.8 * scaleMultiplierRef.current; // Increased multiplier to compensate for transparent padding
        const glassesHeight = glassesWidth * 0.5; // Maintain the 2:1 aspect ratio of the 1000x500 canvas
        
        // Center of the glasses should sit precisely on the nose bridge
        const cx = noseBridge.x * canvas.width;
        const cy = noseBridge.y * canvas.height;

        ctx.translate(cx, cy);
        ctx.rotate(angle);
        
        const currentImg = activeImageRef.current;
        if (currentImg) {
          ctx.drawImage(
            currentImg, 
            -glassesWidth / 2, 
            (-glassesHeight / 2) + yOffsetRef.current, 
            glassesWidth, 
            glassesHeight
          );
        }
      }
      ctx.restore();
    });

    const camera = new window.Camera(videoElement, {
      onFrame: async () => {
        if (videoRef.current) {
          await faceMesh.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480
    });

    camera.start().then(() => setIsInitializing(false)).catch(err => {
      console.error("Camera failed to start", err);
      setIsInitializing(false);
    });

    return () => {
      camera.stop();
      faceMesh.close();
    };
  }, []);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto flex flex-col h-full space-y-6 pb-6">
      {/* Header */}
      <div className="glass-card p-6 flex justify-between items-center border-l-4 border-l-primary shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-onSurface tracking-tight">{t('virtualMirror.title')}</h1>
          <p className="text-onSurfaceVariant text-sm">{t('virtualMirror.subtitle')}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 items-stretch">
        {/* Main AR Canvas Container (Left side, Square) */}
        <div className="relative w-full max-w-[600px] aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-primary/20 shadow-ambient group flex items-center justify-center mx-auto lg:mx-0 shrink-0">
          <video ref={videoRef} style={{ display: 'none' }} playsInline></video>
          {/* Canvas for rendering the merged view */}
          <canvas ref={canvasRef} className="w-full h-full object-cover" />

          {/* Cyberpunk UI Overlays */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/70 rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/70 rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/70 rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/70 rounded-br-lg"></div>

          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-50 items-center">
            <button 
              onClick={() => adjustScale(0.1)}
              className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 hover:bg-emerald-500/20 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-all"
            >
              +
            </button>
            <span className="text-[10px] font-mono text-primary bg-slate-900/80 px-2 py-1 rounded border border-primary/30">
              {scaleDisplay.toFixed(1)}x
            </span>
            <button 
              onClick={() => adjustScale(-0.1)}
              className="bg-slate-900/70 backdrop-blur-md border border-slate-700/50 hover:bg-emerald-500/20 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-all"
            >
              -
            </button>
          </div>

          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary/30">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-primary text-xs font-mono tracking-widest uppercase hidden sm:inline">{t('virtualMirror.scanningPD')}</span>
          </div>
          
          {/* Vertical Offset Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-50">
            <button 
              onClick={() => adjustVerticalPosition(-2)}
              className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-lg p-2 text-white hover:bg-emerald-500/20 transition-all flex items-center justify-center w-10 h-10"
              title="Move Up"
            >
              ▲
            </button>
            <span className="text-[10px] font-mono text-primary bg-slate-900/80 px-2 py-1 rounded border border-primary/30">
              Y: {yOffset > 0 ? '+' : ''}{yOffset}px
            </span>
            <button 
              onClick={() => adjustVerticalPosition(2)}
              className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-lg p-2 text-white hover:bg-emerald-500/20 transition-all flex items-center justify-center w-10 h-10"
              title="Move Down"
            >
              ▼
            </button>
          </div>
          
          {isInitializing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-primary font-mono tracking-widest animate-pulse">{t('virtualMirror.initializingOptics')}</p>
            </div>
          )}
        </div>

        {/* Frame Selector Dock (Right Side) */}
        <div className="glass-card p-6 flex-1 flex flex-col max-h-[600px]">
          <h3 className="text-sm text-onSurfaceVariant uppercase tracking-widest mb-4 pl-2 shrink-0 border-b border-outlineVariant/30 pb-2">{t('virtualMirror.selectFrame')}</h3>
          <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
            {FRAMES.map((frame) => (
              <button
                key={frame.id}
                onClick={() => setActiveFrameId(frame.id)}
                className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col items-center justify-center ${
                  activeFrameId === frame.id 
                    ? 'border-2 border-primary shadow-[0_0_15px_rgba(16,185,129,0.3)] bg-slate-800/80' 
                    : 'border border-outlineVariant/20 bg-slate-800/40 hover:bg-slate-800/60'
                }`}
              >
                <div className="absolute inset-0 p-4 flex items-center justify-center">
                  <img src={frame.src} alt={frame.name} className="w-full object-contain filter drop-shadow-lg" />
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent p-2 text-center pt-8">
                  <span className={`text-xs font-mono font-medium tracking-wide ${activeFrameId === frame.id ? 'text-primary' : 'text-slate-300'}`}>
                    {frame.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
