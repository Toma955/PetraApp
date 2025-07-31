// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { Analytics, track } from '@vercel/analytics/react';
import StartScreen from './StartScreen';
import AudioPlayer from './AudioPlayer';
import lyrics from './lyrics';
import audioFile from './PetraKarin.wav';

function App() {
  const [started, setStarted] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [sessionStartTime] = useState(Date.now());
  const [songPlayed, setSongPlayed] = useState(false);
  const [songPlayCount, setSongPlayCount] = useState(0);
  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const sessionStartTimeRef = useRef(Date.now());

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
      
      // Track with Vercel Analytics
      track('device_info', {
        screenSize: `${window.screen.width}x${window.screen.height}`,
        platform: deviceInfo.platform,
        isMobile: deviceInfo.isMobile,
        pixelRatio: deviceInfo.pixelRatio
      });
      
      // Track screen resolution separately
      track('screen_resolution', {
        width: window.screen.width,
        height: window.screen.height,
        ratio: `${window.screen.width}x${window.screen.height}`
      });
      
      // Track device type
      track('device_type', {
        type: deviceInfo.isMobile ? 'mobile' : 'desktop',
        platform: deviceInfo.platform,
        isAndroid: deviceInfo.isAndroid,
        isIOS: deviceInfo.isIOS
      });
      
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
      
      // Track app start with Vercel Analytics
      track('app_started', {
        platform: isAndroid ? 'Android' : isIOS ? 'iOS' : 'Desktop',
        screenSize: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        isMobile: isMobile
      });
      
      fetch('/api/track-app-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(startAnalyticsData)
      }).catch(err => console.log('Analytics error:', err));
    }
  };

  // Track song play events
  const handleSongPlay = () => {
    setSongPlayed(true);
    setSongPlayCount(prev => prev + 1);
    
    track('song_played', {
      playCount: songPlayCount + 1,
      timestamp: new Date().toISOString(),
      sessionDuration: Math.round((Date.now() - sessionStartTimeRef.current) / 1000)
    });
    
    console.log('🎵 Song played! Count:', songPlayCount + 1);
  };

  // Track song end
  const handleSongEnd = () => {
    track('song_ended', {
      totalPlayTime: totalPlayTime,
      playCount: songPlayCount,
      sessionDuration: Math.round((Date.now() - sessionStartTimeRef.current) / 1000)
    });
    
    console.log('⏹️ Song ended! Total play time:', totalPlayTime);
  };

  // Track session duration when user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionDuration = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);
      
      track('session_ended', {
        sessionDuration: sessionDuration,
        songPlayed: songPlayed,
        songPlayCount: songPlayCount,
        totalPlayTime: totalPlayTime
      });
      
      console.log('👋 Session ended! Duration:', sessionDuration, 'seconds');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [songPlayed, songPlayCount, totalPlayTime]);

  return (
    <div className="app-container">
      <div className="aurora-extra"></div>
      {!started ? (
        <StartScreen onStart={handleStart} />
                        ) : (
                    <AudioPlayer
                      audioSrc={audioFile}
                      lyrics={lyrics}
                      onPlay={handleSongPlay}
                      onEnded={handleSongEnd}
                      onTimeUpdate={(currentTime) => setTotalPlayTime(currentTime)}
                    />
                  )}
      <Analytics />
    </div>
  );
}

export default App;
