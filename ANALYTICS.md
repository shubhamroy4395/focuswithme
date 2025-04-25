# Analytics Tracking Documentation

This document outlines the analytics events tracked in Focus With Me using Amplitude.

## Event Types

| Event Name | Event Key | Description |
|------------|-----------|-------------|
| Timer Start | `timer_start` | Fired when a timer session is started |
| Timer Pause | `timer_pause` | Fired when a timer session is paused |
| Timer Reset | `timer_reset` | Fired when a timer session is reset |
| Timer Complete | `timer_complete` | Fired when a timer countdown reaches zero |
| Session Complete | `session_complete` | Fired when a full focus or break session is completed |
| Settings Updated | `settings_updated` | Fired when user changes timer settings |
| Theme Changed | `theme_changed` | Fired when user changes app theme |
| Vibe Selected | `vibe_selected` | Fired when user selects a background music vibe |
| Vibes Minimized | `vibes_minimized` | Fired when user minimizes the vibes panel |
| Mode Switched | `mode_switched` | Fired when switching between focus and break modes |
| App Opened | `app_opened` | Fired when the application is first loaded |

## Event Parameters

### Timer Events

**Timer Start**
- `mode`: Current timer mode (`focus` or `break`)
- `duration`: Duration in minutes

**Timer Pause**
- `mode`: Current timer mode (`focus` or `break`)
- `timeRemaining`: Seconds remaining when paused

**Timer Reset**
- `mode`: Current timer mode (`focus` or `break`)

**Session Complete**
- `mode`: Completed session mode (`focus` or `break`)

### Settings Events

**Settings Updated**
- Contains all modified settings as properties

**Theme Changed**
- `theme`: The selected theme name

### Vibes Events

**Vibe Selected**
- `vibe`: Name of the selected vibe or `null` if deselected

## Implementation

Events are tracked using the following pattern:

```typescript
import { trackEvent, EventTypes } from './utils/analytics';

// Track events directly
trackEvent(EventTypes.TIMER_START, { mode: 'focus', duration: 25 });

// Or use the helper functions
trackTimerStart('focus', 25);
```

## Helper Functions

The following helper functions are available to track events with consistent parameters:

- `trackTimerStart(mode: string, duration: number)`
- `trackTimerPause(mode: string, timeRemaining: number)`
- `trackTimerReset(mode: string)`
- `trackSessionComplete(mode: string)`
- `trackSettingsChanged(settings: Record<string, any>)`
- `trackThemeChanged(theme: string)`
- `trackVibeSelected(vibe: string | null)` 