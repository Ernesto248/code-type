/**
 * Streak + XP system
 * All data persisted in localStorage
 */

const STORAGE_KEY = 'codetype_streak'
const XP_KEY = 'codetype_xp'

const XP_PER_LESSON = {
  easy: 50,
  medium: 100,
  hard: 150,
}

const LEVEL_THRESHOLDS = [
  0,      // Level 1
  300,    // Level 2
  700,    // Level 3
  1200,   // Level 4
  1800,   // Level 5
  2500,   // Level 6
  3500,   // Level 7
  5000,   // Level 8
  7000,   // Level 9
  10000,  // Level 10
]

// Every 10 levels, reset multiplier
const LEVEL_CAP = 10

// ─── Streak ───

export function getStreak() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { count: 0, lastDate: null }
  } catch {
    return { count: 0, lastDate: null }
  }
}

/**
 * Call this when a lesson is completed.
 * Returns updated streak info.
 */
export function updateStreak() {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0] // YYYY-MM-DD
  const streak = getStreak()

  if (streak.lastDate === todayStr) {
    // Already practiced today, no change
    return streak
  }

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (streak.lastDate === yesterdayStr) {
    // Consecutive day!
    streak.count += 1
  } else if (streak.lastDate === null) {
    // First time
    streak.count = 1
  } else {
    // Streak broken
    streak.count = 1
  }

  streak.lastDate = todayStr
  localStorage.setItem(STORAGE_KEY, JSON.stringify(streak))
  return streak
}

// ─── XP ───

export function getXP() {
  try {
    return JSON.parse(localStorage.getItem(XP_KEY)) || { total: 0, level: 1 }
  } catch {
    return { total: 0, level: 1 }
  }
}

export function addXP(difficulty = 'easy', bonus = 0) {
  const base = XP_PER_LESSON[difficulty] || 50
  const totalXP = base + bonus

  const xp = getXP()
  xp.total += totalXP

  // Recalculate level
  let newLevel = 1
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp.total >= LEVEL_THRESHOLDS[i]) {
      newLevel = i + 1
      break
    }
  }

  const leveledUp = newLevel > xp.level
  xp.level = newLevel

  localStorage.setItem(XP_KEY, JSON.stringify(xp))
  return { ...xp, added: totalXP, leveledUp }
}

export function getLevelProgress() {
  const xp = getXP()
  const currentThreshold = LEVEL_THRESHOLDS[xp.level - 1] || 0
  const nextThreshold = LEVEL_THRESHOLDS[xp.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]

  if (!nextThreshold || currentThreshold === nextThreshold) {
    return { current: xp.total, needed: currentThreshold, progress: 1 }
  }

  const progress = (xp.total - currentThreshold) / (nextThreshold - currentThreshold)
  return {
    current: xp.total - currentThreshold,
    needed: nextThreshold - currentThreshold,
    progress: Math.min(progress, 1),
  }
}
