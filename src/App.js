// src/App.js
import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import StartScreen from './StartScreen';
import AudioPlayer from './AudioPlayer';
import lyrics from './lyrics';
import audioFile from './PetraKarin.wav';

function App() {
  const [started, setStarted] = useState(false);

  // Analytics tracking
  useEffect(() => {
    // Track app load
    if (typeof window !== 'undefined') {
      // Send analytics data
      fetch('/api/track-app-load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          location: window.location.href,
          screenSize: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language
        })
      }).catch(err => console.log('Analytics error:', err));
    }
  }, []);

  const handleStart = () => {
    setStarted(true);
    
    // Track when user starts the app
    if (typeof window !== 'undefined') {
      fetch('/api/track-app-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'app_started',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      }).catch(err => console.log('Analytics error:', err));
    }
  };

  return (
    <div className="app-container">
      <div className="aurora-extra"></div>
      {!started ? (
        <StartScreen onStart={handleStart} />
      ) : (
        <AudioPlayer
          audioSrc={audioFile}
          lyrics={lyrics}
          onEnded={() => {/* ... */}}
        />
      )}
      <Analytics />
    </div>
  );
}

export default App;
