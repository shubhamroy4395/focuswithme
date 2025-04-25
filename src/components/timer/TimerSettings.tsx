import React from 'react';
import SettingsPanel from '../settings/SettingsPanel';

// Re-exporting SettingsPanel as TimerSettings to maintain compatibility with existing imports
const TimerSettings: React.FC = () => {
  // Provide a no-op function to satisfy the onClose prop requirement
  const handleClose = () => {};
  
  return <SettingsPanel onClose={handleClose} />;
};

export default TimerSettings; 