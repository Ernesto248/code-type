/**
 * Achievement/Insignia system
 */

const ACH_STORAGE_KEY = 'codetype_achievements'

export const ACHIEVEMENTS = [
  { id: 'first-lesson', title: 'Primer Paso', desc: 'Completa tu primera lección', icon: '🌱' },
  { id: 'perfect-accuracy', title: 'Precisión Perfecta', desc: '100% de precisión en una lección', icon: '🎯' },
  { id: 'speed-demon', title: 'Lengua de Fuego', desc: 'Más de 60 wpm en una lección', icon: '⚡' },
  { id: 'streak-3', title: 'Racha de 3', desc: 'Practica 3 días seguidos', icon: '🔥' },
  { id: 'streak-7', title: 'Racha de 7', desc: 'Practica 7 días seguidos', icon: '💎' },
  { id: 'level-3', title: 'Nivel 3', desc: 'Alcanza el nivel 3', icon: '⭐' },
  { id: 'level-5', title: 'Nivel 5', desc: 'Alcanza el nivel 5', icon: '🌟' },
  { id: 'hard-lesson', title: 'Sin Miedo', desc: 'Completa una lección difícil', icon: '💪' },
  { id: 'completist', title: 'Completista', desc: 'Termina todas las lecciones de un módulo', icon: '🏆' },
  { id: 'focused', title: 'En la Zona', desc: 'Completa una lección en Focus Mode', icon: '🧘' },
]

export function getAchievements() {
  try {
    return JSON.parse(localStorage.getItem(ACH_STORAGE_KEY)) || []
  } catch {
    return []
  }
}

export function unlockAchievement(id) {
  const list = getAchievements()
  if (list.includes(id)) return false // already unlocked

  list.push(id)
  localStorage.setItem(ACH_STORAGE_KEY, JSON.stringify(list))
  return true // new unlock
}

export function isUnlocked(id) {
  return getAchievements().includes(id)
}

/**
 * Check all achievement conditions based on context.
 * Returns array of newly unlocked achievements.
 */
export function checkAchievements(context) {
  const newlyUnlocked = []

  // first-lesson
  if (context.lessonsCompleted >= 1 && !isUnlocked('first-lesson')) {
    if (unlockAchievement('first-lesson')) newlyUnlocked.push('first-lesson')
  }

  // perfect-accuracy
  if (context.accuracy === 100 && !isUnlocked('perfect-accuracy')) {
    if (unlockAchievement('perfect-accuracy')) newlyUnlocked.push('perfect-accuracy')
  }

  // speed-demon
  if (context.wpm >= 60 && !isUnlocked('speed-demon')) {
    if (unlockAchievement('speed-demon')) newlyUnlocked.push('speed-demon')
  }

  // hard-lesson
  if (context.difficulty === 'hard' && !isUnlocked('hard-lesson')) {
    if (unlockAchievement('hard-lesson')) newlyUnlocked.push('hard-lesson')
  }

  // streak-3 / streak-7
  if (context.streak >= 3 && !isUnlocked('streak-3')) {
    if (unlockAchievement('streak-3')) newlyUnlocked.push('streak-3')
  }
  if (context.streak >= 7 && !isUnlocked('streak-7')) {
    if (unlockAchievement('streak-7')) newlyUnlocked.push('streak-7')
  }

  // level-3 / level-5
  if (context.level >= 3 && !isUnlocked('level-3')) {
    if (unlockAchievement('level-3')) newlyUnlocked.push('level-3')
  }
  if (context.level >= 5 && !isUnlocked('level-5')) {
    if (unlockAchievement('level-5')) newlyUnlocked.push('level-5')
  }

  // completist
  if (context.moduleComplete && !isUnlocked('completist')) {
    if (unlockAchievement('completist')) newlyUnlocked.push('completist')
  }

  // focused
  if (context.focusMode && !isUnlocked('focused')) {
    if (unlockAchievement('focused')) newlyUnlocked.push('focused')
  }

  return newlyUnlocked
}
