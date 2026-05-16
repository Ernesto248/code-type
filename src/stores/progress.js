/**
 * Lesson progress persistence
 */

const STORAGE_KEY = 'codetype_progress'
const STATS_KEY = 'codetype_stats'

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function markLessonComplete(lessonId, stats = {}) {
  const progress = loadProgress()
  progress[lessonId] = {
    completed: true,
    completedAt: Date.now(),
    completions: (progress[lessonId]?.completions || 0) + 1,
    ...stats,
  }
  saveProgress(progress)

  // Update global stats
  updateGlobalStats(stats)

  return progress
}

export function isLessonComplete(lessonId) {
  return !!loadProgress()[lessonId]?.completed
}

export function getCompletedCount() {
  return Object.values(loadProgress()).filter(p => p.completed).length
}

export function getLessonAttempts(lessonId) {
  return loadProgress()[lessonId]?.completions || 0
}

export function getTotalCompletions() {
  const p = loadProgress()
  return Object.values(p).reduce((sum, l) => sum + (l.completions || 1), 0)
}

// ─── Global stats ───

export function getGlobalStats() {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY)) || {
      totalLessons: 0,
      avgWpm: 0,
      avgAccuracy: 0,
      bestWpm: 0,
      totalErrors: 0,
      lastLessonDate: null,
    }
  } catch {
    return {}
  }
}

function updateGlobalStats(stats) {
  const g = getGlobalStats()
  g.totalLessons++
  g.totalErrors += stats.errors || 0

  // Running average
  g.avgWpm = Math.round(((g.avgWpm * (g.totalLessons - 1)) + (stats.wpm || 0)) / g.totalLessons)
  g.avgAccuracy = Math.round(((g.avgAccuracy * (g.totalLessons - 1)) + (stats.accuracy || 100)) / g.totalLessons)

  if ((stats.wpm || 0) > g.bestWpm) g.bestWpm = stats.wpm
  g.lastLessonDate = Date.now()

  localStorage.setItem(STATS_KEY, JSON.stringify(g))
}
