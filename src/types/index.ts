// Add a global declaration for snowfallInterval
declare global {
  interface Window {
    snowfallInterval: NodeJS.Timeout | undefined;
  }
}

export type TimerMode = 'focus' | 'break';

export interface TimerSettings {
  focusDuration: number; // minutes
  breakDuration: number; // minutes
  totalHours: number;
}

export interface TimerState {
  mode: TimerMode;
  timeRemaining: number; // seconds
  isRunning: boolean;
  currentSession: number;
  totalSessions: number;
  sessionProgress: number; // 0-100
  isPostponed: boolean;
  waitingForUserAfterBreak: boolean;
}

export interface Vibe {
  id: string;
  name: string;
  type: 'preset' | 'custom';
  videoId?: string; // YouTube video ID
  url?: string;     // Full URL for custom vibes
  thumbnailUrl: string;
  category?: string; // Category for grouping vibes
  description?: string; // Short description of the vibe
  theme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

export interface AppSettings {
  lightMode: boolean;
  notificationsEnabled: boolean;
  volume: number; // 0-100
  theme: 'default' | 'light' | 'winter'; // Theme options
}

export interface AppState {
  timer: TimerState;
  settings: TimerSettings;
  appSettings: AppSettings;
  currentVibe: Vibe | null;
} 