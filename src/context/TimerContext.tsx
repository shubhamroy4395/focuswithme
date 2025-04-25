import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, TimerMode, TimerSettings, AppSettings, Vibe } from '../types';
import { calculateTotalSessions } from '../utils/timeUtils';

// Default values
const DEFAULT_FOCUS_DURATION = 25; // 25 minutes
const DEFAULT_BREAK_DURATION = 5;  // 5 minutes
const DEFAULT_TOTAL_HOURS = 1;     // 1 hour

// Initial state
const initialState: AppState = {
  timer: {
    mode: 'focus',
    timeRemaining: DEFAULT_FOCUS_DURATION * 60, // converted to seconds
    isRunning: false,
    currentSession: 1,
    totalSessions: (DEFAULT_TOTAL_HOURS * 60) / (DEFAULT_FOCUS_DURATION + DEFAULT_BREAK_DURATION),
    sessionProgress: 0,
    isPostponed: false,
    waitingForUserAfterBreak: false
  },
  settings: {
    focusDuration: DEFAULT_FOCUS_DURATION,
    breakDuration: DEFAULT_BREAK_DURATION,
    totalHours: DEFAULT_TOTAL_HOURS
  },
  appSettings: {
    lightMode: false,
    notificationsEnabled: true,
    volume: 50,
    theme: 'default'
  },
  currentVibe: null
};

// Add audio variable at the top, outside of components
const timerEndSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

// Action types
type ActionType =
  | { type: 'START_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'TICK' }
  | { type: 'SWITCH_MODE'; mode: TimerMode }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<TimerSettings> }
  | { type: 'UPDATE_APP_SETTINGS'; settings: Partial<AppSettings> }
  | { type: 'SET_VIBE'; vibe: Vibe | null }
  | { type: 'POSTPONE_BREAK' }
  | { type: 'USER_RETURNED' }
  | { type: 'SET_THEME'; theme: 'default' | 'light' | 'winter' }
  | { type: 'STOP_TIMER' };

// Reducer function
function timerReducer(state: AppState, action: ActionType): AppState {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: true
        }
      };

    case 'PAUSE_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: false
        }
      };

    case 'RESET_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          timeRemaining: state.timer.mode === 'focus' 
            ? state.settings.focusDuration * 60 
            : state.settings.breakDuration * 60,
          isRunning: false,
          sessionProgress: 0
        }
      };

    case 'TICK':
      if (state.timer.timeRemaining <= 0) {
        // Time's up - switch modes
        const newMode = state.timer.mode === 'focus' ? 'break' : 'focus';
        const newSession = newMode === 'focus' ? state.timer.currentSession + 1 : state.timer.currentSession;
        
        // Play sound when focus session ends (switching to break)
        if (state.timer.mode === 'focus') {
          timerEndSound.play().catch(e => console.log('Audio play failed:', e));
        }
        
        // Check if we've completed all sessions
        if (newSession > state.timer.totalSessions) {
          return {
            ...state,
            timer: {
              ...state.timer,
              isRunning: false,
              timeRemaining: 0
            }
          };
        }

        return {
          ...state,
          timer: {
            ...state.timer,
            mode: newMode,
            timeRemaining: newMode === 'focus' 
              ? state.settings.focusDuration * 60 
              : state.settings.breakDuration * 60,
            currentSession: newSession,
            sessionProgress: 0,
            waitingForUserAfterBreak: newMode === 'focus'
          }
        };
      }

      // Calculate session progress
      const totalTimeForMode = state.timer.mode === 'focus' 
        ? state.settings.focusDuration * 60 
        : state.settings.breakDuration * 60;
      const elapsedTime = totalTimeForMode - state.timer.timeRemaining;
      const progress = (elapsedTime / totalTimeForMode) * 100;

      return {
        ...state,
        timer: {
          ...state.timer,
          timeRemaining: state.timer.timeRemaining - 1,
          sessionProgress: progress
        }
      };

    case 'SWITCH_MODE':
      return {
        ...state,
        timer: {
          ...state.timer,
          mode: action.mode,
          timeRemaining: action.mode === 'focus' 
            ? state.settings.focusDuration * 60 
            : state.settings.breakDuration * 60,
          sessionProgress: 0,
          isRunning: true
        }
      };

    case 'UPDATE_SETTINGS':
      const newSettings = { ...state.settings, ...action.settings };
      
      // Calculate new total sessions based on settings
      const totalMinutes = newSettings.totalHours * 60;
      const cycleLength = newSettings.focusDuration + newSettings.breakDuration;
      const totalSessions = Math.floor(totalMinutes / cycleLength);

      return {
        ...state,
        settings: newSettings,
        timer: {
          ...state.timer,
          timeRemaining: state.timer.mode === 'focus' 
            ? newSettings.focusDuration * 60 
            : newSettings.breakDuration * 60,
          totalSessions
        }
      };

    case 'UPDATE_APP_SETTINGS':
      return {
        ...state,
        appSettings: {
          ...state.appSettings,
          ...action.settings
        }
      };

    case 'SET_VIBE':
      return {
        ...state,
        currentVibe: action.vibe
      };

    case 'POSTPONE_BREAK':
      if (state.timer.mode !== 'break') return state;
      
      return {
        ...state,
        timer: {
          ...state.timer,
          isPostponed: true,
          timeRemaining: 60, // Set break to 1 minute
          sessionProgress: ((state.settings.breakDuration * 60 - 60) / (state.settings.breakDuration * 60)) * 100
        }
      };

    case 'USER_RETURNED':
      if (!state.timer.waitingForUserAfterBreak) return state;
      
      return {
        ...state,
        timer: {
          ...state.timer,
          waitingForUserAfterBreak: false,
          isRunning: true
        }
      };

    case 'SET_THEME':
      return {
        ...state,
        appSettings: {
          ...state.appSettings,
          theme: action.theme
        }
      };

    case 'STOP_TIMER':
      return {
        ...state,
        timer: {
          ...initialState.timer,
          mode: 'focus',
          currentSession: 1,
          timeRemaining: state.settings.focusDuration * 60,
          totalSessions: calculateTotalSessions(
            state.settings.totalHours,
            state.settings.focusDuration,
            state.settings.breakDuration
          ),
          isRunning: false,
          sessionProgress: 0,
          waitingForUserAfterBreak: false
        }
      };

    default:
      return state;
  }
}

// Create the context
interface TimerContextType {
  state: AppState;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  updateSettings: (settings: Partial<TimerSettings>) => void;
  updateAppSettings: (settings: Partial<AppSettings>) => void;
  setVibe: (vibe: Vibe | null) => void;
  postponeBreak: () => void;
  userReturned: () => void;
  setTheme: (theme: 'default' | 'light' | 'winter') => void;
  stopTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

// Provider component
interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  // Timer tick effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (state.timer.isRunning && !state.timer.waitingForUserAfterBreak) {
      timer = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.timer.isRunning, state.timer.waitingForUserAfterBreak]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('timerState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState) as AppState;
        // Only load certain parts of the state to avoid issues
        dispatch({ type: 'UPDATE_SETTINGS', settings: parsedState.settings });
        dispatch({ type: 'UPDATE_APP_SETTINGS', settings: parsedState.appSettings });
        if (parsedState.currentVibe) {
          dispatch({ type: 'SET_VIBE', vibe: parsedState.currentVibe });
        }
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('timerState', JSON.stringify({
      settings: state.settings,
      appSettings: state.appSettings,
      currentVibe: state.currentVibe
    }));
  }, [state.settings, state.appSettings, state.currentVibe]);

  // Add an effect to apply light mode class to the body
  useEffect(() => {
    if (state.appSettings.lightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [state.appSettings.lightMode]);

  // Add an effect to apply theme classes to the body
  useEffect(() => {
    // Remove all theme classes first
    document.body.classList.remove('light-mode', 'winter-theme');
    
    // Apply the appropriate theme class
    switch(state.appSettings.theme) {
      case 'light':
        document.body.classList.add('light-mode');
        break;
      case 'winter':
        document.body.classList.add('winter-theme');
        break;
      default:
        // Default dark theme - no class needed
        break;
    }
  }, [state.appSettings.theme]);

  // Context value
  const value = {
    state,
    startTimer: () => dispatch({ type: 'START_TIMER' }),
    pauseTimer: () => dispatch({ type: 'PAUSE_TIMER' }),
    resetTimer: () => dispatch({ type: 'RESET_TIMER' }),
    updateSettings: (settings: Partial<TimerSettings>) => dispatch({ type: 'UPDATE_SETTINGS', settings }),
    updateAppSettings: (settings: Partial<AppSettings>) => dispatch({ type: 'UPDATE_APP_SETTINGS', settings }),
    setVibe: (vibe: Vibe | null) => dispatch({ type: 'SET_VIBE', vibe }),
    postponeBreak: () => dispatch({ type: 'POSTPONE_BREAK' }),
    userReturned: () => dispatch({ type: 'USER_RETURNED' }),
    setTheme: (theme: 'default' | 'light' | 'winter') => dispatch({ type: 'SET_THEME', theme }),
    stopTimer: () => dispatch({ type: 'STOP_TIMER' })
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};

// Custom hook to use the timer context
export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}; 