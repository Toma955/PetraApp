// src/StartScreen.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './StartScreen.css';
import backgroundImage from './PetraKarin.JPG';
import audioFile from './PetraKarin.wav';
import lyrics from './lyrics';

const StartScreen = ({ onStart }) => {
  const [isFaded, setIsFaded] = useState(false);
  const [isSecondFlipped, setIsSecondFlipped] = useState(false);
  const [isThirdFlipped, setIsThirdFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyricsHistory, setLyricsHistory] = useState([]);
  const [isSongEnded, setIsSongEnded] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showSplitButtons, setShowSplitButtons] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [buttonResponse, setButtonResponse] = useState('');
  const [isCancelled, setIsCancelled] = useState(false);
  
  const [isNoButtonInstagram, setIsNoButtonInstagram] = useState(false);
  const [webappAnswer, setWebappAnswer] = useState('');
  const [songAnswer, setSongAnswer] = useState('');
  const [headphonesAnswer, setHeadphonesAnswer] = useState('');
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [showDropdown3, setShowDropdown3] = useState(false);
  const instagramLink = 'https://www.instagram.com/_petrakarin/';
  const audioRef = useRef(new Audio(audioFile));

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartClick = () => {
    setIsFaded(true);
    setCurrentMessage(1);
    setLyricsHistory([]); // Clear lyrics history when starting
    const buttonContainer = document.querySelector('.button-container');
    if (buttonContainer) {
      buttonContainer.classList.add('clicked');
    }
    const iconsContainer = document.querySelector('.icons-container');
    if (iconsContainer) {
      iconsContainer.classList.add('show-headset-indicator');
    }

  };

  const handlePlayClick = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      


             // Check if song has ended
       if (currentTime >= duration) {
         setIsSongEnded(true);
         setIsPlaying(false);
         audioRef.current.pause();
         
         // Clear lyrics history when song ends
         setLyricsHistory([]);
         
         

                   // Change text after song ends - prebaci na fazu 3
          setTimeout(() => {
            setCurrentMessage(3);
          }, 2000);
       }

      // Find current lyric based on time
      const currentLyric = lyrics.find((lyric, index) => {
        const nextLyric = lyrics[index + 1];
        return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
      });
      
      if (currentLyric) {
        // Add to history if it's a new lyric
        setLyricsHistory(prev => {
          const lastLyric = prev[prev.length - 1];
          if (lastLyric && lastLyric.text !== currentLyric.text) {
            const newHistory = [...prev, { text: currentLyric.text, time: currentLyric.time }];
            // Keep only last 6 lyrics
            if (newHistory.length > 6) {
              newHistory.splice(0, newHistory.length - 6);
            }
                         // Auto-scroll to bottom after state update
             setTimeout(() => {
               const lyricsDisplay = document.querySelector('.lyrics-display');
               if (lyricsDisplay) {
                 lyricsDisplay.scrollTop = lyricsDisplay.scrollHeight;
               }
               const lyricsContainer = document.querySelector('.lyrics-container');
               if (lyricsContainer) {
                 lyricsContainer.scrollTop = lyricsContainer.scrollHeight;
               }
             }, 100);
            return newHistory;
          } else if (prev.length === 0) {
            const newHistory = [{ text: currentLyric.text, time: currentLyric.time }];
            setTimeout(() => {
              const lyricsDisplay = document.querySelector('.lyrics-display');
              if (lyricsDisplay) {
                lyricsDisplay.scrollTop = lyricsDisplay.scrollHeight;
              }
              const lyricsContainer = document.querySelector('.lyrics-container');
              if (lyricsContainer) {
                lyricsContainer.scrollTop = lyricsContainer.scrollHeight;
              }
            }, 100);
            return newHistory;
          }
          return prev;
        });
      }
    }
  };



  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleNextClick = useCallback(() => {
    if (currentMessage === 0) {
      setCurrentMessage(1);
      setDisplayedText(renderMessageContent(1));
      // Move circle to info icon
      const iconsContainer = document.querySelector('.icons-container');
      if (iconsContainer) {
        iconsContainer.classList.add('show-info-indicator');
      }
    } else if (currentMessage === 1) {
      // Move circle to question mark icon
      const iconsContainer = document.querySelector('.icons-container');
      if (iconsContainer) {
        iconsContainer.classList.add('show-question-indicator');
      }
      
      setIsTransitioning(true);
      
      const welcomeText = document.querySelector('.welcome-text');
      const welcomeBox = document.querySelector('.welcome-box');
      if (welcomeText && welcomeBox) {
        welcomeText.classList.add('fade-out');
        welcomeBox.classList.add('shrink');
      }
      
      const mainButton = document.querySelector('.start-button');
      if (mainButton) {
        mainButton.classList.add('rotated');
        setShowSplitButtons(true);
        setShowBackground(true);
      }
      
      setTimeout(() => {
        setIsSecondFlipped(true);
        setTimeout(() => {
          setCurrentMessage(2);
          setDisplayedText(renderMessageContent(2));
          setIsTransitioning(false);
          if (welcomeText) {
            welcomeText.classList.remove('fade-out');
          }
        }, 400);
      }, 800);
    } else if (currentMessage === 2) {
      setIsThirdFlipped(true);
      setTimeout(() => {
        setCurrentMessage(3);
        setDisplayedText(renderMessageContent(3));
      }, 400);
    } else if (currentMessage === 3 && isSongEnded) {
      // When song has ended and user clicks button, show da/ne options
      setShowSplitButtons(true);
      setShowBackground(true);
      setCurrentMessage(2); // Go back to message 2 which shows the da/ne options
      setDisplayedText(renderMessageContent(2));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMessage, isSongEnded]);

  const handleButtonClick = (isYes) => {
    if (isYes) {
             setButtonResponse(`--Hvala ti, kad budeš stekla povjerenje javi se, nadao sam se ovom odgovoru`);
      setIsNoButtonInstagram(true);
    } else {
      if (isNoButtonInstagram) {
        // Track Instagram click
        if (typeof window !== 'undefined') {
          fetch('/api/track-instagram-click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'instagram_click',
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              instagramLink: instagramLink
            })
          }).catch(err => console.log('Analytics error:', err));
        }
        window.open(instagramLink, '_blank');
      } else {
        setIsCancelled(true);
        
        // Close window after 5 seconds
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.close();
            // Fallback for browsers that don't allow window.close()
            window.location.href = 'about:blank';
          }
        }, 5000);
      }
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('0957211881').then(() => {
             setButtonResponse('--Broj je kopiran');
    }).catch(err => {
      setButtonResponse('--Greška pri kopiranju broja. Pokušaj ponovno.');
    });
  };

  const handleDropdownToggle = (dropdownNumber) => {
    if (dropdownNumber === 1) {
      setShowDropdown1(!showDropdown1);
      setShowDropdown2(false);
      setShowDropdown3(false);
    } else if (dropdownNumber === 2) {
      setShowDropdown2(!showDropdown2);
      setShowDropdown1(false);
      setShowDropdown3(false);
    } else if (dropdownNumber === 3) {
      setShowDropdown3(!showDropdown3);
      setShowDropdown1(false);
      setShowDropdown2(false);
    }
  };

  const handleAnswerSelect = (question, answer) => {
    if (question === 'webapp') {
      setWebappAnswer(answer);
      setShowDropdown1(false);
    } else if (question === 'song') {
      setSongAnswer(answer);
      setShowDropdown2(false);
    } else if (question === 'headphones') {
      setHeadphonesAnswer(answer);
      setShowDropdown3(false);
    }
  };

  const handleHeaderButtonClick = (buttonType) => {
    switch(buttonType) {
      case 'query':
        setCurrentMessage(2);
        setDisplayedText(renderMessageContent(2));
        break;
      case 'tables':
        setCurrentMessage(2);
        setDisplayedText(renderMessageContent(2));
        break;
      case 'results':
        setCurrentMessage(3);
        setDisplayedText(renderMessageContent(3));
        break;
      default:
        break;
    }
  };

  const getDisplayText = (answer) => {
    return answer || 'Odaberi odgovor...';
  };

    const renderMessageContent = useCallback((messageType) => {
    switch(messageType) {
                                                          case 0:
                  return (
                    <div className="sql-panel">
                      <div className="sql-panel-header">Database Query Result</div>
                      <div className="sql-query">
                        <span className="sql-keyword">SELECT</span> <span className="sql-operator">*</span><br/>
                        <span className="sql-keyword">FROM</span> <span className="sql-table">pjesme</span><br/>
                        <span className="sql-keyword">WHERE</span> <span className="sql-column">"Stvoreno za"</span> <span className="sql-operator">=</span> <span className="sql-string">'Petra'</span><br/>
                        &nbsp;&nbsp;<span className="sql-keyword">AND</span> <span className="sql-column">naslov</span> <span className="sql-operator">=</span> <span className="sql-string">'Ona stvarna ti'</span><br/>
                        <span className="sql-keyword">LIMIT</span> <span className="sql-number">1</span><span className="sql-operator">;</span>
                      </div>
                      <div className="button-container">
                        <button 
                          className="start-button" 
                          onClick={isFaded ? (isSongEnded ? handleNextClick : handlePlayClick) : handleStartClick}
                        >
                          {isFaded ? (isPlaying ? 'Pause Query' : (isSongEnded ? 'Execute Next' : 'Execute Query')) : 'Connect to Server'}
                        </button>
                      </div>
                    </div>
                  );
                                   case 1:
          return (
            <div className="sql-panel">
                          <div className="sql-panel-header">Query</div>
              <div className="sql-query">
                <span className="sql-keyword">SELECT</span> <span className="sql-operator">*</span><br/>
                <span className="sql-keyword">FROM</span> <span className="sql-table">pjesme</span><br/>
                <span className="sql-keyword">WHERE</span> <span className="sql-column">"Stvoreno za"</span> <span className="sql-operator">=</span> <span className="sql-string">'Petra'</span><br/>
                &nbsp;&nbsp;<span className="sql-keyword">AND</span> <span className="sql-column">naslov</span> <span className="sql-operator">=</span> <span className="sql-string">'Ona stvarna ti'</span><br/>
                <span className="sql-keyword">LIMIT</span> <span className="sql-number">1</span><span className="sql-operator">;</span>
              </div>
              <div className="button-container">
                <button 
                  className="start-button" 
                  onClick={isFaded ? (isSongEnded ? handleNextClick : handlePlayClick) : handleStartClick}
                  style={{
                    background: '#e1e1e1',
                    color: '#000000',
                    border: '1px solid #c1c1c1',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'Segoe UI, sans-serif',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <i className="fa-solid fa-play" style={{ color: '#00ff00', fontSize: '12px' }}></i>
                  {isFaded ? (isPlaying ? 'Pause Query' : (isSongEnded ? 'Execute Next' : 'Execute Query')) : 'Connect to Server'}
                </button>
              </div>
            </div>
          );
                        case 2:
        return (
            <div className="sql-panel">
                          <div className="sql-panel-header">Database Analysis</div>
              <div className="sql-query">
                <span className="sql-keyword">SELECT</span> <span className="sql-operator">*</span><br/>
                <span className="sql-keyword">FROM</span> <span className="sql-table">pjesme</span><br/>
                <span className="sql-keyword">WHERE</span> <span className="sql-column">"Stvoreno za"</span> <span className="sql-operator">=</span> <span className="sql-string">'Petra'</span><br/>
                &nbsp;&nbsp;<span className="sql-keyword">AND</span> <span className="sql-column">naslov</span> <span className="sql-operator">=</span> <span className="sql-string">'Ona stvarna ti'</span><br/>
                <span className="sql-keyword">LIMIT</span> <span className="sql-number">1</span><span className="sql-operator">;</span>
              </div>
              <div className="button-container">
                <button 
                  className="start-button" 
                  onClick={isFaded ? (isSongEnded ? handleNextClick : handlePlayClick) : handleStartClick}
                >
                  {isFaded ? (isPlaying ? 'Pause Query' : (isSongEnded ? 'Execute Next' : 'Execute Query')) : 'Connect to Server'}
                </button>
              </div>
            </div>
          );
            case 3:
        return (
          <div className="sql-panel">
            <div className="sql-panel-header">Final Query Result</div>
            <div className="welcome-text">
              <p>Svi naljepši <span className="highlight">ljubavni filmovi</span> i pjesme su napisane tek nakon što si se rodila...</p>
            </div>
            <div className="button-container">
              <button 
                className="start-button" 
                onClick={handleNextClick}
              >
                Continue
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [handleNextClick, isFaded, isPlaying, isSongEnded]);

  useEffect(() => {
    if (isFaded) {
      const audio = audioRef.current;
      audio.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [isFaded]);

  useEffect(() => {
    setDisplayedText(renderMessageContent(currentMessage));
  }, [currentMessage, renderMessageContent]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.input-field') && !event.target.closest('.dropdown-options')) {
        setShowDropdown1(false);
        setShowDropdown2(false);
        setShowDropdown3(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="start-screen">
      <div className="icons-container">
        {isFaded && currentMessage >= 1 && !showSplitButtons ? (
          <div className="header-buttons">
            <button 
              className={`header-button ${currentMessage === 1 ? 'active' : ''}`}
              onClick={() => handleHeaderButtonClick('query')}
            >
              <i className="fa-solid fa-code"></i>
              <span>Query</span>
            </button>
            <button 
              className={`header-button ${currentMessage === 2 ? 'active' : ''}`}
              onClick={() => handleHeaderButtonClick('database')}
            >
              <i className="fa-solid fa-database"></i>
              <span>Database</span>
            </button>
            <button 
              className={`header-button ${currentMessage === 3 ? 'active' : ''}`}
              onClick={() => handleHeaderButtonClick('results')}
            >
              <i className="fa-solid fa-chart-line"></i>
              <span>Results</span>
            </button>
          </div>
        ) : showSplitButtons ? (
          <div className="header-title">
            <span style={{ color: '#0078d4', fontWeight: 'bold', fontSize: '16px' }}>
              Pitanje zbog koga ovo sve postoji
            </span>
          </div>
        ) : (
          <div className="header-title">
            <i className="fa-solid fa-plug"></i>
            <span>Connecting...</span>
          </div>
        )}
      </div>
      <div className="landscape-warning">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
          <path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h1.5C23.44 4.84 18.29 0 12 0l-.66.03 3.81 3.81 1.33-1.32zm-6.25-.77c-.59-.59-1.54-.59-2.12 0L1.75 8.11c-.59.59-.59 1.54 0 2.12l12.02 12.02c.59.59 1.54.59 2.12 0l6.36-6.36c.59-.59.59-1.54 0-2.12L10.23 1.75zm4.6 19.44L2.81 9.17l6.36-6.36 12.02 12.02-6.36 6.36zm-7.31.29C4.25 19.94 1.91 16.76 1.55 13H.05C.56 19.16 5.71 24 12 24l.66-.03-3.81-3.81-1.33 1.32z"/>
        </svg>
        <p>Molimo okrenite uređaj u vertikalni položaj za najbolje SQL Server Management Studio iskustvo</p>
      </div>
      {showBackground && (
        <div 
          className="background-image" 
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundColor: 'transparent'
          }} 
        />
      )}
      {!showSplitButtons && (
        <div className={`welcome-box ${isFaded ? 'faded' : ''} ${isSecondFlipped ? 'second-flipped' : ''} ${isThirdFlipped ? 'third-flipped' : ''}`}>
          <div className="welcome-box-inner">
            {!isFaded && (
              <div className="window-controls">
                <div className="close-button">×</div>
                <div className="window-title">Connect to Server</div>
              </div>
            )}
            <div className="welcome-box-front">
              <h1 className="welcome-text">
                <div className="dialog-content">
                  <div className="main-title">SQL Server Petra Edition</div>
                  <div className="microsoft-orange-bar"></div>
                  <div className="connection-properties">
                    <div className="property-group">
                      <div className="input-group">
                        <label>Jesi li ikad dobila webapp?</label>
                        <div className="input-field" onClick={() => handleDropdownToggle(1)}>
                          <span>{getDisplayText(webappAnswer)}</span>
                          <span className="dropdown-arrow">▼</span>
                        </div>
                        {showDropdown1 && (
                          <div className="dropdown-options">
                            <div className="dropdown-option" onClick={() => handleAnswerSelect('webapp', 'Da')}>Da</div>
                            <div className="dropdown-option" onClick={() => handleAnswerSelect('webapp', 'Ne')}>Ne</div>
                            <div className="dropdown-option" onClick={() => handleAnswerSelect('webapp', 'Možda')}>Možda</div>
                            <div className="dropdown-option" onClick={() => handleAnswerSelect('webapp', 'Sigurno')}>Sigurno</div>
                            <div className="dropdown-option" onClick={() => handleAnswerSelect('webapp', 'Nikad')}>Nikad</div>
                          </div>
                        )}
                      </div>
                      <div className="input-group">
                        <label>Jesi li ikad dobila pjesmu?</label>
                        <div className="input-field" onClick={() => handleDropdownToggle(2)}>
                          <span>{getDisplayText(songAnswer)}</span>
                          <span className="dropdown-arrow">▼</span>
                        </div>
                        {showDropdown2 && (
                          <div className="dropdown-options">
                            <div className="dropdown-option" onClick={() => handleAnswerSelect('song', 'Da')}>Da</div>
                            <div className="dropdown-option" onClick={() => handleAnswerSelect('song', 'Ne')}>Ne</div>
                            <div className="dropdown-option" onClick={() => handleAnswerSelect('song', 'Možda')}>Možda</div>
                            <div className="dropdown-option" onClick={() => handleAnswerSelect('song', 'Sigurno')}>Sigurno</div>
                            <div className="dropdown-option" onClick={() => handleAnswerSelect('song', 'Nikad')}>Nikad</div>
                          </div>
                        )}
                      </div>
                      <div className="input-group">
                        <label>Imaš li slušalice?</label>
                        <div className="input-field" onClick={() => handleDropdownToggle(3)}>
                          <span>{getDisplayText(headphonesAnswer)}</span>
                          <span className="dropdown-arrow">▼</span>
                        </div>
                        {showDropdown3 && (
                          <div className="dropdown-options">
                            <div className="dropdown-option" onClick={() => handleAnswerSelect('headphones', 'Da')}>Da</div>
                            <div className="dropdown-option" onClick={() => handleAnswerSelect('headphones', 'Ne')}>Ne</div>
                            <div className="dropdown-option" onClick={() => handleAnswerSelect('headphones', 'Možda')}>Možda</div>
                            <div className="dropdown-option" onClick={() => handleAnswerSelect('headphones', 'Sigurno')}>Sigurno</div>
                            <div className="dropdown-option" onClick={() => handleAnswerSelect('headphones', 'Nikad')}>Nikad</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {!isFaded && (
                  <div className="dialog-buttons">
                    <button 
                      className="start-button" 
                      onClick={isFaded ? (isSongEnded ? handleNextClick : handlePlayClick) : handleStartClick}
                    >
                      {isFaded ? (isPlaying ? 'Pause Query' : (isSongEnded ? 'Execute Next' : 'Execute Query')) : 'Connect to Server'}
                    </button>
                  </div>
                )}
              </h1>
            </div>
            <div className="welcome-box-back">
              <div className="welcome-text-overlay">
                {!isTransitioning && displayedText}
                {lyricsHistory.length > 0 && !isSongEnded && (
                  <div className="lyrics-container">
                    <div className="lyrics-display">
                      {lyricsHistory.map((lyric, index) => (
                        <div key={index} className="lyrics-line">
                          <div className="lyrics-time-container">
                            <div className="lyrics-time">[{formatTime(lyric.time)}]</div>
                          </div>
                          <div className="lyrics-text">{lyric.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

                                                       {showSplitButtons && !buttonResponse && (
           <div className="final-message">
                             <div className="sql-query-white">
                  {isCancelled ? (
                    <span className="sql-comment">--Oprosti na smetnji</span>
                  ) : (
                    <>
                      <span className="sql-comment">-- sam te htio pitat prvio dan kad sam te vidio</span><br/>
                      <span className="sql-keyword">SELECT</span> <span className="sql-operator">*</span><br/>
                      <span className="sql-keyword">FROM</span> <span className="sql-table">Najzanimljivija_osoba</span><br/>
                      <span className="sql-keyword">WHERE</span> <span className="sql-column">ime</span> <span className="sql-operator">=</span> <span className="sql-string">'Petra'</span><br/>
                      &nbsp;&nbsp;<span className="sql-keyword">AND</span> <span className="sql-column">status</span> <span className="sql-operator">=</span> <span className="sql-string">'Sloboda'</span><br/>
                      &nbsp;&nbsp;<span className="sql-keyword">AND</span> <span className="sql-keyword">EXISTS</span> <span className="sql-operator">(</span><br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="sql-keyword">SELECT</span> <span className="sql-number">1</span><br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="sql-keyword">FROM</span> <span className="sql-table">kava</span><br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="sql-keyword">WHERE</span> <span className="sql-column">lokacija</span> <span className="sql-operator">=</span> <span className="sql-string">'gdje god poželiš'</span>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="sql-keyword">AND</span> <span className="sql-column">vrijeme</span> <span className="sql-operator">=</span> <span className="sql-string">'kad god poželiš'</span><br/>
                      &nbsp;&nbsp;<span className="sql-operator">)</span><span className="sql-operator">;</span>
                    </>
                  )}
                </div>
           </div>
         )}

         {showSplitButtons && !buttonResponse && (
           <div className="button-container" style={{ 
             position: 'fixed',
             bottom: '30px',
             left: '0',
             right: '0',
             display: 'flex',
             justifyContent: 'center',
             gap: '15px',
             zIndex: '10',
             padding: '0 20px'
           }}>
             <button 
               className="start-button" 
               onClick={() => handleButtonClick(true)}
               style={{
                 background: '#107c10',
                 color: '#ffffff',
                 border: '1px solid #107c10',
                 marginRight: '10px'
               }}
             >
               Execute Query
             </button>
             <button 
               className="start-button" 
               onClick={() => handleButtonClick(false)}
               style={{
                 background: '#d13438',
                 color: '#ffffff',
                 border: '1px solid #d13438'
               }}
             >
               Cancel Query
             </button>
           </div>
         )}

             {buttonResponse && (
         <div className="button-response">
           {buttonResponse}
           {buttonResponse.includes('Query executed successfully') && (
             <div style={{
               marginTop: '20px',
               textAlign: 'center'
             }}>
               <button
                 className="start-button"
                 onClick={handleCopyNumber}
                 style={{
                   background: '#0078d4',
                   color: '#ffffff',
                   border: '1px solid #0078d4',
                   padding: '10px 20px',
                   borderRadius: '4px',
                   cursor: 'pointer',
                   fontSize: '14px',
                   fontWeight: '500'
                 }}
                                >
                   0957211881
                 </button>
             </div>
           )}
         </div>
       )}




      
      {/* SQL Server Status Bar */}
      <div className="sql-status-bar">
        <span>{isFaded ? (isPlaying ? 'Executing Query...' : (isSongEnded ? 'Query Completed' : 'Ready to Execute')) : 'Ready'}</span>
        {isFaded && isPlaying && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            marginLeft: 'auto'
          }}>
            <div 
              style={{ 
                width: '100px',
                height: '4px',
                background: '#30363d',
                borderRadius: '2px',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onClick={(e) => {
                if (audioRef.current) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const percentage = clickX / rect.width;
                  const newTime = percentage * audioRef.current.duration;
                  audioRef.current.currentTime = newTime;
                }
              }}
            >
              <div style={{ 
                height: '100%',
                background: '#58a6ff',
                width: `${audioRef.current ? (audioRef.current.currentTime / audioRef.current.duration) * 100 : 0}%`,
                transition: 'width 0.1s ease-out'
              }}></div>
            </div>
            <span style={{ fontSize: '11px', color: '#8b949e' }}>
              {audioRef.current ? `${Math.floor(audioRef.current.currentTime)}s / ${Math.floor(audioRef.current.duration)}s` : '0s / 0s'}
            </span>
          </div>
        )}
        <span style={{ marginLeft: 'auto' }}>Server Status</span>
      </div>
    </div>
  );
};

export default StartScreen;
