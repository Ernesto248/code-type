const STORAGE_KEY = 'codetype_progress'

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
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
    ...stats,
  }
  saveProgress(progress)
  return progress
}

export function isLessonComplete(lessonId) {
  const progress = loadProgress()
  return !!progress[lessonId]?.completed
}

export function getCompletedCount() {
  const progress = loadProgress()
  return Object.values(progress).filter(p => p.completed).length
}
