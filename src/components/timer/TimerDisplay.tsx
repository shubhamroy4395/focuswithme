import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from '../../context/TimerContext';
import { formatTime } from '../../utils/timeUtils';
import { PlayIcon, PauseIcon, ArrowPathIcon, StopIcon, ClockIcon } from '@heroicons/react/24/solid';

interface TimerDisplayProps {
  isMinimal?: boolean;
  isUIHidden?: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ isMinimal = false, isUIHidden = false }) => {
  const { state, startTimer, pauseTimer, resetTimer, userReturned, stopTimer, updateSettings } = useTimer();
  const { timer, settings } = state;
  const [animate, setAnimate] = useState(true);
  const [showFocusControls, setShowFocusControls] = useState(false);

  // Animation settings
  useEffect(() => {
    // Only pulse animation when timer is running
    setAnimate(timer.isRunning);
  }, [timer.isRunning]);

  // Determine background color based on mode
  const bgColor = timer.mode === 'focus' 
    ? 'bg-gradient-to-br from-primary-dark to-primary' 
    : timer.waitingForUserAfterBreak 
      ? 'bg-gradient-to-br from-accent to-accent/80' 
      : 'bg-gradient-to-br from-neutral-light to-neutral';

  const textColor = 'text-white';

  // Handler for the "I'm here" button when returning from break
  const handleUserReturn = () => {
    userReturned();
  };

  // Function to handle doubly confirming stop actions
  const [confirmStop, setConfirmStop] = useState(false);
  const handleStopClick = () => {
    if (confirmStop) {
      stopTimer();
      setConfirmStop(false);
    } else {
      setConfirmStop(true);
      // Reset confirmation after 3 seconds
      setTimeout(() => setConfirmStop(false), 3000);
    }
  };

  // Generate session indicators
  const renderSessionIndicators = () => {
    // Get total sessions directly from the timer state
    const totalSessions = timer.totalSessions;
    
    // In Pomodoro, sessions are counted as focus sessions
    // Each focus session except the last is followed by a break
    const focusSessions = totalSessions;
    const breakSessions = totalSessions - 1; // Last focus session has no break
    
    // Calculate total duration for proper proportions
    const totalDuration = (settings.focusDuration * focusSessions) + 
                          (settings.breakDuration * breakSessions);
    
    // Define segment type for TypeScript
    interface SessionSegment {
      type: 'focus' | 'break';
      duration: number;
      sessionNumber: number; // Which focus session this belongs to
    }
    
    // Create array for all segments to be shown - alternating focus and break
    const allSegments: SessionSegment[] = [];
    for (let i = 0; i < totalSessions; i++) {
      // Add focus segment
      allSegments.push({
        type: 'focus',
        duration: settings.focusDuration,
        sessionNumber: i + 1
      });
      
      // Add break segment after each focus session except the last one
      if (i < totalSessions - 1) {
        allSegments.push({
          type: 'break',
          duration: settings.breakDuration,
          sessionNumber: i + 1 // Break belongs to the focus session that just ended
        });
      }
    }
    
    // Determine current segment index
    let currentSegmentIdx = 0;
    
    // The timer's currentSession is the focus session number (1-based)
    const currentFocusSession = Math.max(1, timer.currentSession); // Ensure we never go below 1
    
    // Debug logging to help identify the issue
    console.log('Timer state:', {
      currentSession: timer.currentSession,
      mode: timer.mode,
      totalSessions: timer.totalSessions,
      isRunning: timer.isRunning
    });
    
    // If we're in focus mode, we're at segment 2*(currentSession-1)
    // If we're in break mode, we're at segment 2*(currentSession-1)+1
    if (timer.mode === 'focus') {
      currentSegmentIdx = 2 * (currentFocusSession - 1);
    } else {
      currentSegmentIdx = 2 * (currentFocusSession - 1) + 1;
    }
    
    // Ensure we don't go past the array bounds
    currentSegmentIdx = Math.min(currentSegmentIdx, allSegments.length - 1);
    
    // Calculate completion percentage more accurately
    const sessionsCompleted = Math.max(0, currentFocusSession - 1);
    const percentComplete = Math.floor((sessionsCompleted / totalSessions) * 100);
    
    return (
      <div className="w-full mt-4">
        {/* Session text above the progress bar */}
        <div className="flex justify-between text-xs text-neutral-light mb-1 px-1">
          <span>{timer.isRunning || timer.sessionProgress > 0 ? `${currentFocusSession} of ${totalSessions}` : `Starting: 1 of ${totalSessions}`} {totalSessions > 1 ? 'sessions' : 'session'}</span>
          <span>{`${percentComplete}% complete`}</span>
        </div>
        
        <div className="h-4 w-full rounded-full overflow-hidden relative bg-neutral-dark/20">
          {/* Create all segments */}
          {allSegments.map((segment, i) => {
            const isFocus = segment.type === 'focus';
            
            // Handle the case where timer just started - first segment should be active
            let isCurrent = i === currentSegmentIdx;
            if (currentFocusSession === 1 && timer.mode === 'focus' && timer.sessionProgress === 0 && i === 0) {
              isCurrent = true;
            }
            
            const isCompleted = i < currentSegmentIdx;
            
            // Calculate segment width based on proportion of total time
            const segmentWidth = (segment.duration / totalDuration) * 100;
            
            // Calculate position
            let segmentOffset = 0;
            for (let j = 0; j < i; j++) {
              segmentOffset += (allSegments[j].duration / totalDuration) * 100;
            }
            
            // Label text
            const labelText = isFocus ? 'Focus' : 'Break';
            
            return (
              <div
                key={i}
                className="absolute top-0 bottom-0"
                style={{
                  left: `${segmentOffset}%`,
                  width: `${segmentWidth}%`,
                  backgroundColor: `var(--${isFocus ? 'focus' : 'break'}-${
                    isCurrent ? 'track' :
                    isCompleted ? 'completed' :
                    'future'
                  })`,
                  height: !isFocus ? '70%' : '100%',
                  top: !isFocus ? '15%' : '0', // Center shorter break segments
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Only show label if segment is wide enough */}
                {segmentWidth > 7 && (
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-neutral-dark/70 whitespace-nowrap overflow-hidden text-center" style={{maxWidth: '90%'}}>
                    {labelText}
                  </span>
                )}
                
                {isCurrent && (
                  <motion.div
                    className="absolute top-0 left-0 h-full"
                    style={{
                      backgroundColor: `var(--${isFocus ? 'focus' : 'break'}-progress)`,
                      width: `${timer.sessionProgress}%`,
                      boxShadow: `0 0 8px var(--${isFocus ? 'focus' : 'break'}-progress)`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${timer.sessionProgress}%` }}
                    transition={{ duration: 0.3, ease: "linear" }}
                  />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Show labels below progress bar */}
        <div className="flex mt-1 justify-center text-xs text-neutral-light">
          <span>Focus ({settings.focusDuration}min) × {focusSessions} | Break ({settings.breakDuration}min) × {breakSessions}</span>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className={`flex flex-col items-center justify-center w-full ${!isMinimal && 'p-8 rounded-2xl shadow-lg glass'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {(!isMinimal || !isUIHidden) && (
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2 
              className="text-2xl font-bold text-neutral-lightest mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Session {timer.currentSession}/{timer.totalSessions}
            </motion.h2>
            <motion.p 
              className="text-neutral-light text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {timer.mode === 'focus' ? 'Focus Session' : 'Break Time'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session progress indicators */}
      <AnimatePresence>
        {(!isMinimal || !isUIHidden) && (
          <motion.div 
            className="w-full mb-8 px-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center w-full">
              {renderSessionIndicators()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer display */}
      <motion.div
        className={`flex items-center justify-center ${isMinimal ? 'w-80 h-80' : 'w-[min(75%,320px)] h-[min(75%,320px)]'} rounded-full ${bgColor} ${textColor} mb-6 relative overflow-hidden timer-circle`}
        animate={animate ? {
          boxShadow: ['0px 0px 30px rgba(99, 91, 255, 0.3)', '0px 0px 60px rgba(139, 92, 246, 0.5)', '0px 0px 30px rgba(99, 91, 255, 0.3)'],
        } : {
          boxShadow: '0px 0px 40px rgba(17, 24, 39, 0.2)'
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        {/* Pulsing backdrop for more dramatic effect when running */}
        {animate && (
          <motion.div 
            className="absolute inset-0 bg-white opacity-10 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        )}
        
        <motion.span 
          className={`${isMinimal ? 'text-8xl' : 'text-7xl'} font-bold z-10 tracking-tight timer-display`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {formatTime(timer.timeRemaining)}
        </motion.span>
      </motion.div>

      {/* Quick Focus Strategy Controls */}
      <AnimatePresence>
        {(!isMinimal || !isUIHidden) && !timer.isRunning && (
          <motion.div 
            className="w-full mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <motion.button
              className="w-full py-2 px-4 flex items-center justify-between text-neutral-light hover:text-neutral-lightest transition-colors"
              onClick={() => setShowFocusControls(!showFocusControls)}
            >
              <span className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                Quick Focus Settings
              </span>
              <motion.span
                animate={{ rotate: showFocusControls ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ▼
              </motion.span>
            </motion.button>
            
            <AnimatePresence>
              {showFocusControls && (
                <motion.div
                  className="mt-4 space-y-4 px-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-neutral-light text-sm">Focus Duration</label>
                      <span className="text-primary-light font-semibold">{settings.focusDuration} min</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={settings.focusDuration}
                      onChange={(e) => updateSettings({ focusDuration: parseInt(e.target.value) })}
                      className="w-full h-2 bg-neutral-20 rounded-lg appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `linear-gradient(to right, var(--primary-light) 0%, var(--primary) ${(settings.focusDuration - 5) / (60 - 5) * 100}%, var(--neutral) ${(settings.focusDuration - 5) / (60 - 5) * 100}%)`,
                        accentColor: 'var(--primary)'
                      }}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-neutral-light text-sm">Break Duration</label>
                      <span className="text-primary-light font-semibold">{settings.breakDuration} min</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={settings.breakDuration}
                      onChange={(e) => updateSettings({ breakDuration: parseInt(e.target.value) })}
                      className="w-full h-2 bg-neutral-20 rounded-lg appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `linear-gradient(to right, var(--primary-light) 0%, var(--primary) ${(settings.breakDuration - 1) / (30 - 1) * 100}%, var(--neutral) ${(settings.breakDuration - 1) / (30 - 1) * 100}%)`,
                        accentColor: 'var(--primary)'
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control buttons */}
      <AnimatePresence>
        {(!isMinimal || !isUIHidden) && (
          <motion.div 
            className="flex space-x-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            {timer.waitingForUserAfterBreak ? (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#c026d3' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUserReturn}
                className="px-8 py-3 bg-accent text-white font-bold rounded-full hover:bg-accent/90 transition-colors shadow-lg btn"
              >
                I'm Here! Resume Focus
              </motion.button>
            ) : (
              <>
                {timer.isRunning ? (
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#f9fafb' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={pauseTimer}
                    className="w-14 h-14 flex items-center justify-center bg-neutral-lightest text-neutral-dark rounded-full hover:bg-neutral-light transition-colors shadow-md btn"
                    aria-label="Pause timer"
                  >
                    <PauseIcon className="w-6 h-6" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#4f46e5' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startTimer}
                    className="w-14 h-14 flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary-dark transition-colors shadow-md btn"
                    aria-label="Start timer"
                  >
                    <PlayIcon className="w-6 h-6" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#f9fafb' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetTimer}
                  className="w-14 h-14 flex items-center justify-center bg-neutral-lightest text-neutral-dark rounded-full hover:bg-neutral-light transition-colors shadow-md btn"
                  aria-label="Reset timer"
                >
                  <ArrowPathIcon className="w-6 h-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: confirmStop ? '#b91c1c' : '#ef4444' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStopClick}
                  className={`w-14 h-14 flex items-center justify-center ${
                    confirmStop ? 'bg-red-700' : 'bg-red-500'
                  } text-white rounded-full hover:bg-red-600 transition-colors shadow-md btn relative`}
                  aria-label="Stop timer"
                >
                  <StopIcon className="w-6 h-6" />
                  {confirmStop && (
                    <motion.span 
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-700 text-white text-xs rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      !
                    </motion.span>
                  )}
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode indicator */}
      <AnimatePresence>
        {(!isMinimal || !isUIHidden) && (
          <motion.div 
            className="text-neutral-light text-base mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {timer.isRunning 
              ? (timer.mode === 'focus' 
                  ? 'Focus mode active' 
                  : 'Taking a break')
              : 'Timer paused'}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TimerDisplay; 