import React, { useRef, useEffect } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer as YTPlayer } from 'react-youtube';
import { useTimer } from '../../context/TimerContext';
import { motion, AnimatePresence } from 'framer-motion';

interface YouTubePlayerProps {
  onVideoSelect: (videoId: string) => void;
  selectedVideoId: string | null;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ onVideoSelect, selectedVideoId }) => {
  const { state, updateAppSettings } = useTimer();
  const playerRef = useRef<YTPlayer | null>(null);
  
  const { appSettings, timer } = state;

  // Popular lo-fi/study music videos
  const popularVideos = [
    { id: 'jfKfPfyJRdk', title: 'lofi hip hop radio 📚 - beats to relax/study to' },
    { id: '5qap5aO4i9A', title: 'lofi hip hop radio - beats to study/relax to' },
    { id: 'DWcJFNfaw9c', title: 'Deep Focus Music - 24/7 concentration and study music' },
    { id: 'n61ULEU7CO0', title: 'relaxing anime music for studying/sleeping' },
    { id: 'lTRiuFIWV54', title: 'Study Music Alpha Waves: Focus, Concentration' },
    { id: 'bLlloaA4b4g', title: 'Ambient Study Music To Concentrate' }
  ];
  
  // Options for the YouTube player
  const opts = {
    height: '300',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
      mute: 0,
      loop: 1,
      playlist: selectedVideoId,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      color: 'white',
      iv_load_policy: 3
    },
  };
  
  // Handle player ready event
  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    
    // Set volume
    if (playerRef.current) {
      playerRef.current.setVolume(appSettings.volume);
    }
  };
  
  // Sync player state with app state
  useEffect(() => {
    if (!playerRef.current) return;
    
    // Update volume when it changes in settings
    playerRef.current.setVolume(appSettings.volume);
    
    // Pause/play based on timer state
    if (timer.isRunning) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [appSettings.volume, timer.isRunning]);

  return (
    <motion.div 
      className="glass p-6 rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-neutral-lightest">Focus Vibes</h2>
        <div className="text-sm text-neutral-light">
          {timer.isRunning ? (
            <motion.div 
              className="flex items-center text-primary-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="w-2 h-2 bg-primary-light rounded-full mr-2 animate-pulse"></span>
              Now Playing
            </motion.div>
          ) : (
            <span>Paused</span>
          )}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {selectedVideoId ? (
          <motion.div 
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative overflow-hidden rounded-xl shadow-xl mb-5"
          >
            <YouTube
              videoId={selectedVideoId}
              opts={opts}
              onReady={onReady}
              className="w-full"
            />
          </motion.div>
        ) : (
          <motion.div 
            key="placeholder"
            className="bg-neutral/20 border border-glass-border rounded-xl flex flex-col items-center justify-center h-64 mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-neutral-light mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <p className="text-neutral-light text-center px-6 mb-4">
              Select a focus vibe to enhance your concentration
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Volume control */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => updateAppSettings({ volume: appSettings.volume === 0 ? 50 : 0 })}
            className="text-neutral-light hover:text-primary transition-colors focus:outline-none"
            aria-label={appSettings.volume === 0 ? "Unmute" : "Mute"}
          >
            {appSettings.volume === 0 ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="100"
              value={appSettings.volume}
              onChange={(e) => updateAppSettings({ volume: parseInt(e.target.value) })}
              className="w-full h-2 bg-neutral/30 rounded-lg appearance-none cursor-pointer"
              style={{
                backgroundImage: `linear-gradient(to right, var(--primary-light) 0%, var(--primary) ${appSettings.volume}%, var(--neutral) ${appSettings.volume}%)`,
                accentColor: 'var(--primary)'
              }}
              aria-label="Volume"
            />
          </div>
          
          <span className="text-sm text-primary-light font-medium w-9 text-right">
            {appSettings.volume}%
          </span>
        </div>
      </div>
      
      {/* Video selection */}
      <div>
        <h3 className="text-sm font-medium text-neutral-light mb-3">Recommended Vibes</h3>
        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
          {popularVideos.map(video => (
            <motion.button
              key={video.id}
              onClick={() => onVideoSelect(video.id)}
              className={`p-2 rounded-lg text-left transition-all ${
                selectedVideoId === video.id 
                  ? 'bg-primary/20 border border-primary/30' 
                  : 'bg-neutral/20 border border-glass-border hover:bg-neutral/30'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start">
                <div className={`w-7 h-7 min-w-[1.75rem] rounded-full flex items-center justify-center mr-2 ${
                  selectedVideoId === video.id ? 'bg-primary/30 text-primary-light' : 'bg-neutral/30 text-neutral-light'
                }`}>
                  {selectedVideoId === video.id ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.5-11a.5.5 0 00-1 0v3h-3a.5.5 0 000 1h3v3a.5.5 0 001 0v-3h3a.5.5 0 000-1h-3V7z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className={`text-xs font-medium truncate max-w-full ${
                    selectedVideoId === video.id ? 'text-primary-light' : 'text-neutral-lightest'
                  }`}>
                    {video.title}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default YouTubePlayer; 