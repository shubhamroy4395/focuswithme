import * as amplitude from '@amplitude/analytics-browser';

// Initialize Amplitude with the API key
export const initAnalytics = () => {
  amplitude.init('a20173a49b1399dac7be654d311edda7', undefined, {
    logLevel: amplitude.Types.LogLevel.Warn,
    defaultTracking: {
      sessions: true,
      pageViews: true,
      formInteractions: true,
      fileDownloads: true,
    },
  });
};

// Track events with optional properties
export const trackEvent = (eventName: string, eventProperties?: Record<string, any>) => {
  amplitude.track(eventName, eventProperties);
};

// Set user ID
export const setUserId = (userId: string) => {
  amplitude.setUserId(userId);
};

// Set user properties
export const setUserProperties = (properties: Record<string, any>) => {
  const identify = new amplitude.Identify();
  
  // Apply each property individually
  Object.entries(properties).forEach(([key, value]) => {
    identify.setOnce(key, value);
  });
  
  amplitude.identify(identify);
};

// Common event types for consistent tracking
export const EventTypes = {
  // Timer events
  TIMER_START: 'timer_start',
  TIMER_PAUSE: 'timer_pause',
  TIMER_RESET: 'timer_reset',
  TIMER_COMPLETE: 'timer_complete',
  SESSION_COMPLETE: 'session_complete',
  
  // Settings events
  SETTINGS_UPDATED: 'settings_updated',
  THEME_CHANGED: 'theme_changed',
  
  // Vibes events
  VIBE_SELECTED: 'vibe_selected',
  VIBES_MINIMIZED: 'vibes_minimized',
  
  // Mode events
  MODE_SWITCHED: 'mode_switched',
  
  // User events
  APP_OPENED: 'app_opened',
};

// Common event tracking functions
export const trackTimerStart = (mode: string, duration: number) => {
  trackEvent('Timer Started', { mode, duration });
};

export const trackTimerPause = (mode: string, timeRemaining: number) => {
  trackEvent('Timer Paused', { mode, timeRemaining });
};

export const trackTimerReset = (mode: string) => {
  trackEvent('Timer Reset', { mode });
};

export const trackSessionComplete = (mode: string) => {
  trackEvent('Session Completed', { mode });
};

export const trackSettingsChanged = (settings: Record<string, any>) => {
  trackEvent('Settings Changed', settings);
};

export const trackThemeChanged = (theme: string) => {
  trackEvent('Theme Changed', { theme });
};

export const trackVibeSelected = (vibe: string | null) => {
  trackEvent('Vibe Selected', { vibe });
}; 