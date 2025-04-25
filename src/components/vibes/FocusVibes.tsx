import React, { useState, useRef, useEffect } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer as YTPlayer } from 'react-youtube';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from '../../context/TimerContext';
import { Vibe } from '../../types';
import { 
  XMarkIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  PauseIcon,
  PlayIcon,
  PlusCircleIcon
} from '@heroicons/react/24/solid';

// Default vibes
const DEFAULT_VIBES: Vibe[] = [
  {
    id: 'lofi',
    name: 'Lo-Fi Beats',
    type: 'preset',
    videoId: 'jfKfPfyJRdk',
    thumbnailUrl: 'https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg',
    description: 'Chill beats to help you focus and study',
    category: 'focus',
    theme: {
      primary: '#4F46E5',
      secondary: '#6366F1',
      background: '#1E293B',
      text: '#F8FAFC'
    }
  },
  {
    id: 'nature',
    name: 'Nature Sounds',
    type: 'preset',
    videoId: 'eKFTSSKCzWA',
    thumbnailUrl: 'https://img.youtube.com/vi/eKFTSSKCzWA/mqdefault.jpg',
    description: 'Peaceful forest and river ambience',
    category: 'nature',
    theme: {
      primary: '#10B981',
      secondary: '#34D399',
      background: '#064E3B',
      text: '#ECFDF5'
    }
  },
  {
    id: 'jazz',
    name: 'Coffee Shop Jazz',
    type: 'preset',
    videoId: 'VMAPTo7RVCo',
    thumbnailUrl: 'https://img.youtube.com/vi/VMAPTo7RVCo/mqdefault.jpg',
    description: 'Smooth jazz with coffee shop ambience',
    category: 'focus',
    theme: {
      primary: '#7C3AED',
      secondary: '#8B5CF6',
      background: '#2E1065',
      text: '#F5F3FF'
    }
  },
  {
    id: 'ambient',
    name: 'Ambient Space',
    type: 'preset',
    videoId: 'tNkZsRW7h2c',
    thumbnailUrl: 'https://img.youtube.com/vi/tNkZsRW7h2c/mqdefault.jpg',
    description: 'Ethereal space sounds for deep focus',
    category: 'ambient',
    theme: {
      primary: '#0EA5E9',
      secondary: '#38BDF8',
      background: '#075985',
      text: '#E0F2FE'
    }
  },
  {
    id: 'fireplace',
    name: 'Fireplace Sounds',
    type: 'preset',
    videoId: 'L_LUpnjgPso',
    thumbnailUrl: 'https://img.youtube.com/vi/L_LUpnjgPso/mqdefault.jpg',
    description: 'Cozy crackling fireplace for relaxation',
    category: 'ambient',
    theme: {
      primary: '#F97316',
      secondary: '#FB923C',
      background: '#7C2D12',
      text: '#FEF3C7'
    }
  },
  {
    id: 'rain',
    name: 'Rain Sounds',
    type: 'preset',
    videoId: 'mPZkdNFkNps',
    thumbnailUrl: 'https://img.youtube.com/vi/mPZkdNFkNps/mqdefault.jpg',
    description: 'Gentle rainfall for concentration',
    category: 'nature',
    theme: {
      primary: '#3B82F6',
      secondary: '#60A5FA',
      background: '#1E3A8A',
      text: '#EFF6FF'
    }
  }
];

// Categories
const CATEGORIES = [
  { id: 'popular', name: 'Popular' },
  { id: 'focus', name: 'Focus' },
  { id: 'ambient', name: 'Ambient' },
  { id: 'nature', name: 'Nature' }
];

interface FocusVibesProps {
  onMinimizedChange?: (isMinimized: boolean) => void;
}

const FocusVibes: React.FC<FocusVibesProps> = ({ onMinimizedChange }) => {
  const { state, setVibe, updateAppSettings } = useTimer();
  const [isMinimized, setIsMinimized] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [activeCategory, setActiveCategory] = useState('popular');
  const playerRef = useRef<YTPlayer | null>(null);
  
  const { appSettings, timer, currentVibe } = state;

  // Filter vibes based on active category
  const filteredVibes = DEFAULT_VIBES.filter(vibe => 
    activeCategory === 'popular' || vibe.category === activeCategory
  );

  // YouTube player options
  const opts = {
    height: '250',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
      mute: 0,
      loop: 1,
      playlist: currentVibe?.videoId || '',
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

  // Handle vibe selection
  const handleVibeSelect = (vibe: Vibe) => {
    setVibe(vibe);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Add custom YouTube video
  const handleAddCustomVideo = () => {
    const videoId = extractVideoId(customUrl);
    
    if (!videoId) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    const customVibe: Vibe = {
      id: `custom-${Date.now()}`,
      name: 'Custom YouTube',
      type: 'custom',
      videoId,
      url: customUrl,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      description: 'Your custom YouTube video',
      category: 'focus',
      theme: {
        primary: '#4F46E5',
        secondary: '#6366F1',
        background: '#1E293B',
        text: '#F8FAFC'
      }
    };

    setVibe(customVibe);
    setCustomUrl('');
    setShowCustomInput(false);
  };

  // Handle volume changes
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAppSettings({ volume: parseInt(e.target.value) });
  };

  // Toggle mute
  const toggleMute = () => {
    updateAppSettings({ volume: appSettings.volume === 0 ? 50 : 0 });
  };

  // Handle container closing
  const handleClose = () => {
    if (currentVibe) {
      setShowCloseConfirm(true);
    } else {
      // If no vibe is playing, just close immediately
      onConfirmClose();
    }
  };

  // Confirm closing
  const onConfirmClose = () => {
    setVibe(null);
    setShowCloseConfirm(false);
    // Here you would add logic to completely hide the vibes component
    // For now, we'll just minimize it
    setIsMinimized(true);
  };

  // Cancel closing
  const cancelClose = () => {
    setShowCloseConfirm(false);
  };

  // Update the setIsMinimized function to also call the onMinimizedChange prop
  const handleMinimizedChange = (minimized: boolean) => {
    setIsMinimized(minimized);
    if (onMinimizedChange) {
      onMinimizedChange(minimized);
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Music control button as single icon */}
        <motion.button
          className={`control-button ${
            currentVibe ? 'bg-primary' : 'bg-neutral'
          }`}
          whileHover={{ scale: 1.1, backgroundColor: currentVibe ? 'var(--primary-light)' : 'var(--neutral-light)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleMinimizedChange(false)}
          aria-label="Expand music player"
          title={currentVibe ? `Playing: ${currentVibe.name}` : "Open Focus Vibes"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
          {/* Playing indicator - more prominent */}
          {currentVibe && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
          )}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="backdrop-blur-md rounded-xl overflow-hidden shadow-xl border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Close confirmation modal */}
      <AnimatePresence>
        {showCloseConfirm && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="rounded-xl p-6 max-w-md mx-auto shadow-2xl border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <h3 className="text-xl font-bold mb-2">Stop background audio?</h3>
              <p className="text-neutral-light mb-6">
                This will stop the currently playing audio. You can always restart it later.
              </p>
              <div className="flex space-x-3 justify-end">
                <motion.button
                  className="px-4 py-2 rounded-lg text-neutral-lightest"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={cancelClose}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onConfirmClose}
                >
                  Stop Music
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center">
          <div className="mr-3 bg-primary/20 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Focus Vibes</h2>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {currentVibe 
                ? `Playing: ${currentVibe.name}` 
                : 'Select background music for focus'}
            </p>
          </div>
        </div>
        <div className="flex space-x-1">
          <motion.button
            className="p-2 rounded-full hover:bg-neutral"
            style={{ color: 'var(--text-secondary)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClose}
          >
            <XMarkIcon className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {/* Player section */}
      <AnimatePresence mode="wait">
        {currentVibe ? (
          <motion.div 
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <div className="relative overflow-hidden">
              <YouTube
                videoId={currentVibe.videoId}
                opts={opts}
                onReady={onReady}
                className="w-full"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="placeholder"
            className="w-full flex flex-col items-center justify-center py-16 px-4"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" 
              style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Choose Your Focus Soundtrack</h3>
            <p className="text-center max-w-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
              Select from our curated playlists or add your own YouTube music to enhance your focus sessions.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Volume control */}
      <div className="px-4 py-3 border-b border-neutral">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleMute}
            className="text-neutral-light hover:text-primary transition-colors focus:outline-none"
            aria-label={appSettings.volume === 0 ? "Unmute" : "Mute"}
          >
            {appSettings.volume === 0 ? (
              <SpeakerXMarkIcon className="h-5 w-5" />
            ) : (
              <SpeakerWaveIcon className="h-5 w-5" />
            )}
          </button>
          
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="100"
              value={appSettings.volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-neutral-30 rounded-lg appearance-none cursor-pointer"
              style={{
                backgroundImage: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${appSettings.volume}%, var(--neutral) ${appSettings.volume}%)`,
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
      
      {/* Custom input for YouTube URL */}
      <AnimatePresence>
        {showCustomInput && (
          <motion.div 
            className="px-4 py-3 border-b border-neutral bg-neutral-40"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-neutral-light">Add YouTube URL:</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1 px-3 py-2 bg-neutral rounded-lg text-neutral-lightest text-sm"
                />
                <motion.button
                  className="px-3 py-2 bg-primary text-white rounded-lg text-sm flex items-center"
                  whileHover={{ backgroundColor: 'var(--primary-light)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddCustomVideo}
                >
                  <span>Add</span>
                </motion.button>
              </div>
              <div className="flex justify-end">
                <button 
                  className="text-neutral-light text-xs hover:text-neutral-lightest"
                  onClick={() => setShowCustomInput(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vibes selection */}
      <div className="max-h-80 overflow-y-auto p-4">
        {/* Add custom button */}
        <motion.button
          className="w-full mb-4 py-3 px-4 bg-neutral-40 hover:bg-neutral-60 rounded-lg flex items-center justify-center text-neutral-lightest transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCustomInput(!showCustomInput)}
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          <span>Add Custom YouTube</span>
        </motion.button>

        {/* Vibe categories tabs */}
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                category.id === activeCategory 
                  ? 'bg-primary/20 text-primary-light' 
                  : 'bg-neutral-30 text-neutral-light hover:bg-neutral-50 hover:text-neutral-lightest'
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Vibe grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredVibes.map(vibe => (
            <motion.div
              key={vibe.id}
              className={`rounded-lg overflow-hidden cursor-pointer ${
                currentVibe?.id === vibe.id ? 'ring-2 ring-primary' : ''
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleVibeSelect(vibe)}
            >
              <div className="relative group">
                <img 
                  src={vibe.thumbnailUrl} 
                  alt={vibe.name}
                  className="w-full h-28 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {currentVibe?.id === vibe.id ? (
                    <div className="bg-primary/80 rounded-full p-2">
                      <PauseIcon className="h-6 w-6 text-white" />
                    </div>
                  ) : (
                    <div className="bg-white/80 rounded-full p-2">
                      <PlayIcon className="h-6 w-6 text-neutral-dark" />
                    </div>
                  )}
                </div>
              </div>
              <div className="p-3 bg-neutral-40">
                <h3 className="text-sm font-medium text-neutral-lightest">{vibe.name}</h3>
                <p className="text-xs text-neutral-light truncate mt-1">{vibe.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FocusVibes; 