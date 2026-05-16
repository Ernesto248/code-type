/**
 * Spaced Repetition System
 * Uses a modified SM-2 algorithm for review scheduling.
 */

const STORAGE_KEY = 'codetype_spaced_rep'

const HOUR = 3600000
const DAY = HOUR * 24

// Intervals: 1 day, 3 days, 7 days, 16 days, 30 days
const INTERVALS = [1, 3, 7, 16, 30]

export function getReviewQueue() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

/**
 * Record a review for a lesson.
 * @param {string} lessonId
 * @param {number} quality - 0-5 (how well you remember)
 */
export function recordReview(lessonId, quality) {
  const queue = getReviewQueue()
  const now = Date.now()

  if (!queue[lessonId]) {
    queue[lessonId] = {
      repetitions: 0,
      interval: 0,
      easeFactor: 2.5,
      nextReview: now,
    }
  }

  const card = queue[lessonId]
  card.lastReviewed = now

  if (quality >= 3) {
    // Correct recall
    if (card.repetitions === 0) {
      card.interval = INTERVALS[0] * DAY
    } else if (card.repetitions === 1) {
      card.interval = INTERVALS[1] * DAY
    } else {
      card.interval = Math.round(card.interval * card.easeFactor)
    }
    card.repetitions++
  } else {
    // Failed recall
    card.repetitions = 0
    card.interval = DAY
  }

  // Update ease factor (SM-2)
  card.easeFactor = Math.max(
    1.3,
    card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  card.nextReview = now + card.interval
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))

  return card
}

/**
 * Get lessons due for review
 */
export function getDueLessons() {
  const queue = getReviewQueue()
  const now = Date.now()
  return Object.entries(queue)
    .filter(([, card]) => card.nextReview <= now)
    .sort((a, b) => a[1].nextReview - b[1].nextReview)
    .map(([id]) => id)
}

/**
 * Get next review time for a lesson
 */
export function getNextReview(lessonId) {
  const queue = getReviewQueue()
  if (!queue[lessonId]) return null
  return queue[lessonId].nextReview
}

/**
 * Get all cards for streak calc
 */
export function getReviewCount() {
  return Object.keys(getReviewQueue()).length
}
