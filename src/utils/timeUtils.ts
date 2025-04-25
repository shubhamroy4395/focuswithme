/**
 * Format seconds into MM:SS format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

/**
 * Format seconds into human-readable text
 */
export function formatTimeText(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds} seconds`;
  } else if (minutes === 1) {
    return remainingSeconds > 0 
      ? `1 minute ${remainingSeconds} seconds` 
      : `1 minute`;
  } else {
    return remainingSeconds > 0 
      ? `${minutes} minutes ${remainingSeconds} seconds` 
      : `${minutes} minutes`;
  }
}

/**
 * Calculate total sessions based on hours, focus duration, and break duration
 */
export function calculateTotalSessions(
  totalHours: number, 
  focusDuration: number, 
  breakDuration: number
): number {
  const totalMinutes = totalHours * 60;
  const cycleLength = focusDuration + breakDuration;
  return Math.floor(totalMinutes / cycleLength);
}

/**
 * Calculate the total time including all focus and break sessions
 */
export function calculateTotalTime(
  sessions: number,
  focusDuration: number,
  breakDuration: number
): number {
  // Total focus time
  const totalFocusMinutes = sessions * focusDuration;
  
  // Total break time (one less break than focus sessions)
  const totalBreakMinutes = (sessions - 1) * breakDuration;
  
  return totalFocusMinutes + totalBreakMinutes;
} 