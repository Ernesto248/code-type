import lesson01 from './01-variables.js'
import lesson02 from './02-strings.js'
import lesson03 from './03-conditionals.js'
import lesson04 from './04-loops.js'
import lesson05 from './05-functions.js'
import lesson06 from './06-arrays-basics.js'
import lesson07 from './07-arrays-map.js'
import lesson08 from './08-arrays-filter.js'
import lesson09 from './09-arrays-reduce.js'
import lesson10 from './10-fetch-basic.js'

export const lessons = [
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson05,
  lesson06,
  lesson07,
  lesson08,
  lesson09,
  lesson10,
]

export function getLesson(id) {
  return lessons.find(l => l.id === id)
}

export function getNextLesson(currentId) {
  const idx = lessons.findIndex(l => l.id === currentId)
  if (idx >= 0 && idx < lessons.length - 1) return lessons[idx + 1]
  return null
}

export function getLessonsByModule(module) {
  return lessons.filter(l => l.module === module)
}

export function getModules() {
  return [...new Set(lessons.map(l => l.module))]
}
