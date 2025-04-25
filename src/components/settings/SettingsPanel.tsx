import React, { useState } from 'react';
import { useTimer } from '../../context/TimerContext';
import { calculateTotalSessions } from '../../utils/timeUtils';
import { motion } from 'framer-motion';
import { XMarkIcon, MoonIcon, SparklesIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { state, updateSettings, updateAppSettings } = useTimer();
  const { settings, appSettings } = state;

  // Local state for the sliders
  const [focusDuration, setFocusDuration] = useState(settings.focusDuration);
  const [breakDuration, setBreakDuration] = useState(settings.breakDuration);
  const [totalHours, setTotalHours] = useState(settings.totalHours);
  const [volume, setVolume] = useState(appSettings.volume);

  // Update settings in context when sliders change
  const handleFocusDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFocusDuration(value);
    updateSettings({ focusDuration: value });
  };

  const handleBreakDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setBreakDuration(value);
    updateSettings({ breakDuration: value });
  };

  const handleTotalHoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setTotalHours(value);
    updateSettings({ totalHours: value });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setVolume(value);
    updateAppSettings({ volume: value });
  };

  const handleNotificationsToggle = () => {
    updateAppSettings({ notificationsEnabled: !appSettings.notificationsEnabled });
  };

  // Handle theme selection
  const handleSetTheme = (theme: 'default' | 'winter') => {
    updateAppSettings({ theme, lightMode: false }); // Always keep lightMode false
  };

  // Determine if a theme is active
  const isThemeActive = (theme: 'default' | 'winter') => {
    return appSettings.theme === theme;
  };

  // For snow effect in winter theme
  const createSnowflakes = () => {
    // Clean up any existing snow container
    const existingContainer = document.querySelector('.snow-container');
    if (existingContainer) {
      document.body.removeChild(existingContainer);
    }
    
    // Only create snowflakes if winter theme is active
    if (appSettings.theme === 'winter') {
      // Create a snow container
      const snowContainer = document.createElement('div');
      snowContainer.classList.add('snow-container');
      document.body.appendChild(snowContainer);
      
      // Function to create a single snowflake with random properties
      const createSnowflakeElement = () => {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // Random horizontal position
        snowflake.style.left = `${Math.random() * 100}vw`;
        
        // Random size between 2px and 6px
        const size = Math.random() * 4 + 2;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        
        // Random opacity
        snowflake.style.opacity = `${Math.random() * 0.3 + 0.5}`;
        
        // Random animation duration between 10s and 25s
        const duration = Math.random() * 15 + 10;
        snowflake.style.animationDuration = `${duration}s`;
        
        // Random animation delay
        snowflake.style.animationDelay = `${Math.random() * 10}s`;
        
        // Add a random drift factor to make the snowflakes sway
        const randomOffset = Math.random() * 360;
        snowflake.style.setProperty('--random-offset', `${randomOffset}deg`);
        
        return snowflake;
      };
      
      // Create initial batch of snowflakes (300 for a dense effect)
      for (let i = 0; i < 300; i++) {
        const snowflake = createSnowflakeElement();
        // Set staggered animation delay for initial snowflakes
        snowflake.style.animationDelay = `${(i % 30) * 1}s`;
        snowContainer.appendChild(snowflake);
      }
      
      // Setup continuous snowflake creation with global reference for cleanup
      window.snowfallInterval = setInterval(() => {
        // Only continue if winter theme is still active
        if (document.body.classList.contains('winter-theme')) {
          // Check if snow container still exists
          const container = document.querySelector('.snow-container');
          if (container) {
            // Add 5 snowflakes at once for a more dense effect
            for (let i = 0; i < 5; i++) {
              const snowflake = createSnowflakeElement();
              container.appendChild(snowflake);
            }
            
            // Maintain a reasonable number of snowflakes to prevent performance issues
            if (container.childNodes.length > 500) {
              // Remove oldest snowflakes
              for (let i = 0; i < 5; i++) {
                const firstChild = container.firstChild;
                if (firstChild) {
                  container.removeChild(firstChild);
                }
              }
            }
          }
        } else {
          // If winter theme is no longer active, clean up
          clearInterval(window.snowfallInterval);
          const container = document.querySelector('.snow-container');
          if (container) {
            document.body.removeChild(container);
          }
        }
      }, 100); // Add new snowflakes every 100ms for continuous effect
      
      // Return cleanup function
      return () => {
        if (window.snowfallInterval) {
          clearInterval(window.snowfallInterval);
        }
        const container = document.querySelector('.snow-container');
        if (container) {
          document.body.removeChild(container);
        }
      };
    }
  };
  
  // Apply snow effect when winter theme is active and clean up when switching themes
  React.useEffect(() => {
    const cleanup = createSnowflakes();
    
    // Cleanup function to run when component unmounts or theme changes
    return () => {
      if (cleanup) cleanup();
    };
  }, [appSettings.theme]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate total sessions based on current settings
  const totalSessions = calculateTotalSessions(
    totalHours, 
    focusDuration, 
    breakDuration
  );

  return (
    <motion.div 
      className="settings-panel"
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      transition={{ type: "spring", damping: 30 }}
    >
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <button 
          className="close-button" 
          onClick={onClose}
          aria-label="Close settings"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <motion.div 
            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2"
            whileHover={{ scale: 1.05 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </motion.div>
          <h3 className="text-base font-semibold text-neutral-lightest">Focus Strategy</h3>
        </div>
        
        <div className="mb-4 pl-3 border-l-2 border-primary/30">
          <div className="flex justify-between mb-1">
            <label className="text-neutral-light text-sm">Focus Duration</label>
            <span className="text-primary-light font-semibold">{focusDuration} min</span>
          </div>
          <input
            type="range"
            min="5"
            max="60"
            step="5"
            value={focusDuration}
            onChange={handleFocusDurationChange}
            className="w-full h-2 bg-neutral-20 rounded-lg appearance-none cursor-pointer"
            style={{
              backgroundImage: `linear-gradient(to right, var(--primary-light) 0%, var(--primary) ${(focusDuration - 5) / (60 - 5) * 100}%, var(--neutral) ${(focusDuration - 5) / (60 - 5) * 100}%)`,
              accentColor: 'var(--primary)'
            }}
          />
        </div>
        
        <div className="mb-4 pl-3 border-l-2 border-primary/30">
          <div className="flex justify-between mb-1">
            <label className="text-neutral-light text-sm">Break Duration</label>
            <span className="text-primary-light font-semibold">{breakDuration} min</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={breakDuration}
            onChange={handleBreakDurationChange}
            className="w-full h-2 bg-neutral-20 rounded-lg appearance-none cursor-pointer"
            style={{
              backgroundImage: `linear-gradient(to right, var(--primary-light) 0%, var(--primary) ${(breakDuration - 1) / (30 - 1) * 100}%, var(--neutral) ${(breakDuration - 1) / (30 - 1) * 100}%)`,
              accentColor: 'var(--primary)'
            }}
          />
        </div>
        
        <div className="mb-4 pl-3 border-l-2 border-primary/30">
          <div className="flex justify-between mb-1">
            <label className="text-neutral-light text-sm">Total Study Time</label>
            <span className="text-primary-light font-semibold">{totalHours} hour{totalHours > 1 ? 's' : ''}</span>
          </div>
          <div className="relative">
            <select
              value={totalHours}
              onChange={handleTotalHoursChange}
              className="w-full py-2 px-3 rounded-lg border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none pr-10"
              style={{ 
                backgroundColor: 'var(--dropdown-bg)',
                color: 'var(--dropdown-text)', 
                borderColor: 'var(--border-color)'
              }}
            >
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
              <option value="4">4 hours</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-2 rounded-lg border p-3" 
          style={{ 
            backgroundColor: 'var(--bg-tertiary)', 
            borderColor: 'var(--border-color)'
          }}>
          <p className="text-neutral-light text-xs">
            With these settings, you'll have <span className="text-primary-light font-semibold">{totalSessions}</span> focus sessions.
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <motion.div 
            className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-2"
            whileHover={{ scale: 1.05 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          </motion.div>
          <h3 className="text-base font-semibold text-neutral-lightest">Sound & Notifications</h3>
        </div>
        
        <div className="mb-3 pl-3 border-l-2 border-accent/30">
          <div className="flex justify-between mb-1">
            <label className="text-neutral-light text-sm">Volume</label>
            <span className="text-accent font-semibold">{volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-neutral-20 rounded-lg appearance-none cursor-pointer"
            style={{
              backgroundImage: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${volume}%, var(--neutral) ${volume}%)`,
              accentColor: 'var(--accent)'
            }}
          />
        </div>
        
        <div className="flex items-center justify-between pl-3 border-l-2 border-accent/30">
          <label className="text-neutral-light text-sm">Notifications</label>
          <div 
            onClick={handleNotificationsToggle}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              appSettings.notificationsEnabled ? 'bg-accent' : 'bg-neutral-40'
            }`}
          >
            <motion.div 
              className="bg-white w-4 h-4 rounded-full shadow-md"
              initial={false}
              animate={{ 
                x: appSettings.notificationsEnabled ? 24 : 0,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center mb-3">
          <motion.div
            className="w-8 h-8 rounded-full bg-primary-dark/10 flex items-center justify-center mr-2"
            whileHover={{ scale: 1.05 }}
          >
            <ComputerDesktopIcon className="h-4 w-4 text-primary-dark" />
          </motion.div>
          <h3 className="text-base font-semibold text-neutral-lightest">Display & Themes</h3>
        </div>
        
        {/* Theme Selection */}
        <div className="mt-4 pl-3 border-l-2 border-primary-dark/30">
          <label className="text-neutral-light text-sm block mb-2">Theme</label>
          
          <div className="grid grid-cols-2 gap-2">
            {/* Default Theme */}
            <motion.button
              className={`p-3 rounded-lg flex flex-col items-center justify-center ${
                isThemeActive('default') 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-40 hover:bg-neutral-30 text-neutral-lightest'
              }`}
              onClick={() => handleSetTheme('default')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <MoonIcon className="h-6 w-6 mb-1" />
              <span className="text-xs">Dark</span>
            </motion.button>
            
            {/* Winter Theme */}
            <motion.button
              className={`p-3 rounded-lg flex flex-col items-center justify-center ${
                isThemeActive('winter') 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-40 hover:bg-neutral-30 text-neutral-lightest'
              }`}
              onClick={() => handleSetTheme('winter')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <SparklesIcon className="h-6 w-6 mb-1" />
              <span className="text-xs">Winter</span>
            </motion.button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 text-xs text-neutral-light text-center opacity-50">
        Focus With Me • Inspired by Wonderspace
      </div>
    </motion.div>
  );
};

export default SettingsPanel; 