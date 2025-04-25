import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from '../../context/TimerContext';
import { Vibe } from '../../types';
import { ChevronDownIcon, MusicalNoteIcon } from '@heroicons/react/24/solid';

// Default vibes
const DEFAULT_VIBES: Vibe[] = [
  {
    id: 'lofi',
    name: 'Lo-Fi Beats',
    type: 'preset',
    videoId: 'jfKfPfyJRdk',
    thumbnailUrl: 'https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg',
    theme: {
      primary: '#3A86FF',
      secondary: '#8338EC',
      background: '#1E1E24',
      text: '#FFFFFF'
    }
  },
  {
    id: 'nature',
    name: 'Nature Sounds',
    type: 'preset',
    videoId: 'eKFTSSKCzWA',
    thumbnailUrl: 'https://img.youtube.com/vi/eKFTSSKCzWA/mqdefault.jpg',
    theme: {
      primary: '#38B000',
      secondary: '#006466',
      background: '#143601',
      text: '#CCFF33'
    }
  },
  {
    id: 'jazz',
    name: 'Coffee Shop Jazz',
    type: 'preset',
    videoId: 'VMAPTo7RVCo',
    thumbnailUrl: 'https://img.youtube.com/vi/VMAPTo7RVCo/mqdefault.jpg',
    theme: {
      primary: '#9B5DE5',
      secondary: '#F15BB5',
      background: '#0B132B',
      text: '#FFFFFF'
    }
  },
  {
    id: 'ambient',
    name: 'Ambient Space',
    type: 'preset',
    videoId: 'nn4XzYbXFY8',
    thumbnailUrl: 'https://img.youtube.com/vi/nn4XzYbXFY8/mqdefault.jpg',
    theme: {
      primary: '#00B4D8',
      secondary: '#03045E',
      background: '#0A1128',
      text: '#CAF0F8'
    }
  },
  {
    id: 'fireplace',
    name: 'Fireplace Sounds',
    type: 'preset',
    videoId: 'L_LUpnjgPso',
    thumbnailUrl: 'https://img.youtube.com/vi/L_LUpnjgPso/mqdefault.jpg',
    theme: {
      primary: '#FF6D00',
      secondary: '#FF9E00',
      background: '#641220',
      text: '#FFDB99'
    }
  }
];

const VibeSelector: React.FC = () => {
  const { state, setVibe } = useTimer();
  const [isOpen, setIsOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.vibe-selector-container')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleVibeSelect = (vibe: Vibe) => {
    setVibe(vibe);
    setIsOpen(false);
  };

  const handleCustomUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUrl(e.target.value);
  };

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const addCustomVibe = () => {
    const videoId = extractVideoId(customUrl);
    
    if (!videoId) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    const customVibe: Vibe = {
      id: `custom-${Date.now()}`,
      name: 'Custom Vibe',
      type: 'custom',
      videoId,
      url: customUrl,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      theme: {
        primary: '#3A86FF',
        secondary: '#8338EC',
        background: '#1E1E24',
        text: '#FFFFFF'
      }
    };

    setVibe(customVibe);
    setCustomUrl('');
    setShowCustomInput(false);
    setIsOpen(false);
  };

  return (
    <div className="relative vibe-selector-container">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-neutral-dark text-neutral-lightest rounded-lg hover:bg-neutral transition-colors shadow-sm"
      >
        <MusicalNoteIcon className="w-5 h-5" />
        <span>
          {state.currentVibe ? state.currentVibe.name : 'Select Vibe'}
        </span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute top-full left-0 mt-2 w-72 bg-neutral-dark border border-neutral rounded-lg shadow-xl z-20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="p-3">
              <h3 className="text-neutral-lightest font-semibold mb-2 border-b border-neutral pb-2">Select Your Vibe</h3>
              
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 mb-3">
                {DEFAULT_VIBES.map((vibe) => (
                  <motion.div
                    key={vibe.id}
                    onClick={() => handleVibeSelect(vibe)}
                    className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-neutral ${
                      state.currentVibe?.id === vibe.id ? 'bg-neutral' : ''
                    }`}
                    whileHover={{ backgroundColor: '#2d3e56' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img 
                      src={vibe.thumbnailUrl} 
                      alt={vibe.name} 
                      className="w-12 h-12 rounded-md object-cover shadow-sm"
                    />
                    <div>
                      <p className="text-neutral-lightest text-sm font-medium">{vibe.name}</p>
                      <p className="text-neutral-light text-xs">
                        {vibe.type === 'preset' ? 'Preset' : 'Custom'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {showCustomInput ? (
                <div className="mt-3 border-t border-neutral pt-3">
                  <p className="text-neutral-light text-xs mb-2">Enter a YouTube video URL for custom background music</p>
                  <input
                    type="text"
                    value={customUrl}
                    onChange={handleCustomUrlChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full p-2 bg-neutral text-neutral-lightest rounded-md mb-2 text-sm"
                  />
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: '#1d4ed8' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addCustomVibe}
                      className="px-3 py-1.5 bg-primary text-white rounded-md text-sm hover:bg-primary-light transition-colors shadow-sm"
                    >
                      Add
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCustomInput(false)}
                      className="px-3 py-1.5 bg-neutral text-neutral-lightest rounded-md text-sm hover:bg-neutral-light transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#2d3e56' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCustomInput(true)}
                  className="w-full mt-2 p-2 text-sm text-neutral-lightest bg-neutral rounded-md hover:bg-neutral-light transition-colors flex items-center justify-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Add Custom YouTube</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VibeSelector; 