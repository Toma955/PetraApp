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
      // Detect device type and platform
      const userAgent = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isAndroid = /Android/i.test(userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
      const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent);
      
      // Get device details
      const deviceInfo = {
        isMobile,
        isAndroid,
        isIOS,
        isTablet,
        platform: isAndroid ? 'Android' : isIOS ? 'iOS' : 'Desktop',
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio,
        orientation: window.screen.orientation ? window.screen.orientation.type : 'unknown'
      };

      // Send analytics data
      const analyticsData = {
        timestamp: new Date().toISOString(),
        userAgent: userAgent,
        referrer: document.referrer,
        location: window.location.href,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        deviceInfo: deviceInfo
      };
      
      // Log to console for debugging
      console.log('📱 Device Analytics:', analyticsData);
      
      fetch('/api/track-app-load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analyticsData)
      }).catch(err => console.log('Analytics error:', err));
    }
  }, []);

  const handleStart = () => {
    setStarted(true);
    
    // Track when user starts the app
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isAndroid = /Android/i.test(userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
      
      const startAnalyticsData = {
        action: 'app_started',
        timestamp: new Date().toISOString(),
        userAgent: userAgent,
        deviceInfo: {
          isMobile,
          isAndroid,
          isIOS,
          platform: isAndroid ? 'Android' : isIOS ? 'iOS' : 'Desktop',
          screenSize: `${window.screen.width}x${window.screen.height}`,
          viewportSize: `${window.innerWidth}x${window.innerHeight}`
        }
      };
      
      // Log to console for debugging
      console.log('🚀 App Start Analytics:', startAnalyticsData);
      
      fetch('/api/track-app-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(startAnalyticsData)
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
