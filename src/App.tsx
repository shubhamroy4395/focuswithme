import React, { useState, useEffect } from 'react';
import './App.css';
import TimerDisplay from './components/timer/TimerDisplay';
import FocusVibes from './components/vibes/FocusVibes';
import SettingsPanel from './components/settings/SettingsPanel';
import { TimerProvider, useTimer } from './context/TimerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CogIcon, MusicalNoteIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVibesMinimized, setIsVibesMinimized] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const { state } = useTimer();
  const { appSettings, currentVibe } = state;

  // Apply light/dark mode class to body
  useEffect(() => {
    if (appSettings.lightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [appSettings.lightMode]);

  // Toggle settings panel
  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  // Close settings panel
  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  // Handle vibes minimized state
  const handleVibesMinimized = (minimized: boolean) => {
    setIsVibesMinimized(minimized);
  };

  // Toggle vibes panel
  const toggleVibes = () => {
    setIsVibesMinimized(!isVibesMinimized);
  };
  
  // Toggle about modal
  const toggleAbout = () => {
    setIsAboutOpen(!isAboutOpen);
  };
  
  // Close about modal
  const closeAbout = () => {
    setIsAboutOpen(false);
  };

  return (
    <div className="app-container">
      <div className="app-background"></div>
      
      {/* Top Bar */}
      <motion.div
        className="app-top-bar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="app-title-section">
          <h1 className="app-title">Focus With Me</h1>
          <p className="app-subtitle">A minimal Pomodoro timer for productive work sessions</p>
        </div>
        <div className="app-controls-section">
          {isVibesMinimized && (
            <motion.button
              className={`control-button ${currentVibe ? 'vibe-active' : ''}`}
              onClick={toggleVibes}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(99, 91, 255, 0.15)' }}
              whileTap={{ scale: 0.95 }}
              title={currentVibe ? `Playing: ${currentVibe.name}` : "Open Focus Vibes"}
            >
              <MusicalNoteIcon className="h-6 w-6" />
              {currentVibe && (
                <div className="playing-indicator"></div>
              )}
            </motion.button>
          )}
          <motion.button
            className="control-button about-toggle"
            onClick={toggleAbout}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(99, 91, 255, 0.15)' }}
            whileTap={{ scale: 0.95 }}
            title="About Me"
          >
            <UserCircleIcon className="h-6 w-6" />
          </motion.button>
          <motion.button
            className="control-button settings-toggle"
            onClick={toggleSettings}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(99, 91, 255, 0.15)' }}
            whileTap={{ scale: 0.95 }}
            title="Open Settings"
          >
            <CogIcon className="h-6 w-6" />
          </motion.button>
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="app-content">
        <motion.div 
          className={`app-main ${isVibesMinimized ? 'vibes-minimized' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="timer-section">
            <TimerDisplay />
          </div>
          
          {!isVibesMinimized && (
            <div className="vibes-section">
              <FocusVibes onMinimizedChange={handleVibesMinimized} />
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Controls for non-minimized vibes */}
      {isVibesMinimized && (
        <div className="hidden-vibes-container">
          <FocusVibes onMinimizedChange={handleVibesMinimized} />
        </div>
      )}
      
      {/* Settings panel */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSettings}
          ></motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsPanel onClose={closeSettings} />
        )}
      </AnimatePresence>
      
      {/* About Me Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAbout}
          >
            <motion.div
              className="about-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="about-header">
                <h2>About Me</h2>
                <button 
                  className="close-button" 
                  onClick={closeAbout}
                  aria-label="Close about"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="about-content">
                <p>Hi! I'm Shubham Roy, the creator of Focus With Me.</p>
                <p className="mt-2">I'm passionate about productivity and creating tools that help people stay focused and accomplish their goals.</p>
                
                <div className="contact-links">
                  <a 
                    href="https://www.linkedin.com/in/roy-shubham/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contact-link linkedin"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                  
                  <a 
                    href="mailto:shubhamroypm@gmail.com" 
                    className="contact-link email"
                  >
                    <span>shubhamroypm@gmail.com</span>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText('shubhamroypm@gmail.com');
                        const button = e.currentTarget;
                        button.classList.add('copied');
                        setTimeout(() => button.classList.remove('copied'), 2000);
                      }}
                      className="copy-button"
                      title="Copy email address"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Wrapper component with TimerProvider
const AppWithProvider: React.FC = () => {
  return (
    <TimerProvider>
      <App />
    </TimerProvider>
  );
};

export default AppWithProvider;
