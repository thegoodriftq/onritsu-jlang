import { AppStats } from '../types';

/**
 * Get current client local date string YYYY-MM-DD
 */
export function getLocalDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Checks if a specific day's practice logs meet the absolute perfect criteria:
 * 1. At least 2 distinct Japanese letters practiced accurately.
 * 2. Any letter practiced inaccurately on that day must have also been practiced accurately again.
 */
export function isDayPerfect(log: { accuratePractices: string[]; inaccuratePractices: string[] }): boolean {
  if (log.accuratePractices.length < 2) {
    return false;
  }
  // All inaccurate attempts must be corrected on the same day
  for (const char of log.inaccuratePractices) {
    if (!log.accuratePractices.includes(char)) {
      return false;
    }
  }
  return true;
}

/**
 * Checks if a specific day's log has any uncorrected errors (failed, but not passed).
 * Uncorrected letters immediately drag the active streak down to 0!
 */
export function hasUncorrectedInaccuracy(log: { accuratePractices: string[]; inaccuratePractices: string[] }): boolean {
  for (const char of log.inaccuratePractices) {
    if (!log.accuratePractices.includes(char)) {
      return true;
    }
  }
  return false;
}

/**
 * Traverses history backward to calculate the streak accurately as per user instructions
 */
export function calculateStreak(dailyLogs: Record<string, { accuratePractices: string[]; inaccuratePractices: string[] }>): number {
  const todayStr = getLocalDateString();
  const todayLog = dailyLogs[todayStr] || { accuratePractices: [], inaccuratePractices: [] };

  // 1. Check if today currently has any uncorrected inaccuracies. 
  // If so, the streak immediately drops to zero!
  if (hasUncorrectedInaccuracy(todayLog)) {
    return 0;
  }

  let streak = 0;
  const today = new Date();
  
  // Start walking backwards
  let current = new Date(today);
  let isToday = true;

  while (true) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const dayLog = dailyLogs[dateStr];

    if (isToday) {
      if (dayLog) {
        if (hasUncorrectedInaccuracy(dayLog)) {
          return 0; // immediate penalty
        }
        if (isDayPerfect(dayLog)) {
          streak = 1;
        }
      }
      isToday = false;
    } else {
      // For any prior calendar date, we must have achieved the perfect state.
      // If we did not practice at all, or didn't meet the target (2 accurate, 0 uncorrected), the streak halts here!
      if (dayLog && isDayPerfect(dayLog)) {
        streak++;
      } else {
        // Did not practice or failed to complete this prior day. Streak stops here!
        break;
      }
    }

    // Go back by 1 day
    current.setDate(current.getDate() - 1);
  }

  return streak;
}

/**
 * Updates a student's daily stats log for a character.
 */
export function updateStreakStats(stats: AppStats, char: string, isAccurate: boolean): AppStats {
  const todayStr = getLocalDateString();
  const dailyLogs = { ...(stats.dailyLogs || {}) };
  const todayLog = dailyLogs[todayStr] ? { ...dailyLogs[todayStr] } : { accuratePractices: [], inaccuratePractices: [] };

  // Deduplicate and update arrays
  if (isAccurate) {
    if (!todayLog.accuratePractices.includes(char)) {
      todayLog.accuratePractices = [...todayLog.accuratePractices, char];
    }
  } else {
    if (!todayLog.inaccuratePractices.includes(char)) {
      todayLog.inaccuratePractices = [...todayLog.inaccuratePractices, char];
    }
  }

  dailyLogs[todayStr] = todayLog;

  // Compute the correct streak
  const computedStreak = calculateStreak(dailyLogs);

  // Return new AppStats structure
  return {
    ...stats,
    streak: computedStreak,
    dailyLogs
  };
}
