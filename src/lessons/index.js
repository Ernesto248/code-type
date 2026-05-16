import lesson01 from './01-querySelector.js'
import lesson02 from './02-querySelectorAll.js'
import lesson03 from './03-textContent.js'
import lesson04 from './04-classList.js'
import lesson05 from './05-createElement.js'
import lesson06 from './06-events.js'

export const lessons = [
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson05,
  lesson06,
]

export function getLesson(id) {
  return lessons.find(l => l.id === id)
}

export function getNextLesson(currentId) {
  const idx = lessons.findIndex(l => l.id === currentId)
  if (idx >= 0 && idx < lessons.length - 1) return lessons[idx + 1]
  return null
}
