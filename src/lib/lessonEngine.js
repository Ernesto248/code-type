/**
 * Core typing validation engine.
 * Character-by-character comparison with real-time stats.
 */

export class LessonEngine {
  constructor(answer) {
    this.target = answer
    this.chars = [...answer]
    this.currentIndex = 0
    this.errors = 0
    this.totalTyped = 0
    this.startTime = null
    this.endTime = null
    this.isComplete = false
    this.history = [] // Array of { char, correct, index }
  }

  get wpm() {
    if (!this.startTime || !this.endTime) return 0
    const minutes = (this.endTime - this.startTime) / 60000
    if (minutes === 0) return 0
    // Standard WPM: 5 chars = 1 word
    return Math.round((this.totalTyped / 5) / minutes)
  }

  get accuracy() {
    if (this.totalTyped === 0) return 100
    return Math.round(((this.totalTyped - this.errors) / this.totalTyped) * 100)
  }

  get elapsed() {
    if (!this.startTime) return 0
    const end = this.endTime || Date.now()
    return (end - this.startTime) / 1000
  }

  start() {
    if (!this.startTime) {
      this.startTime = Date.now()
    }
  }

  /**
   * Process a single keystroke.
   * Returns { correct, complete, char, expected }
   */
  type(char) {
    if (this.isComplete) return { correct: false, complete: true, char, expected: null }

    this.start()
    
    const expected = this.chars[this.currentIndex]
    
    // Handle backspace (char = null means backspace was pressed externally)
    if (char === null) {
      if (this.history.length > 0) {
        const last = this.history.pop()
        this.currentIndex--
        if (!last.correct) this.errors--
        this.totalTyped--
      }
      return { correct: null, complete: false, char: 'BACKSPACE', expected }
    }

    const correct = char === expected
    this.totalTyped++
    if (!correct) this.errors++

    this.history.push({ char, correct, index: this.currentIndex })
    this.currentIndex++

    if (this.currentIndex >= this.chars.length) {
      this.endTime = Date.now()
      this.isComplete = true
    }

    return { correct, complete: this.isComplete, char, expected }
  }

  /**
   * Get the current state of all characters for rendering
   */
  getCharsState() {
    return this.chars.map((char, i) => {
      if (i < this.currentIndex) {
        const entry = this.history.find(h => h.index === i)
        return {
          char,
          state: entry?.correct ? 'correct' : 'incorrect',
        }
      }
      return {
        char,
        state: i === this.currentIndex ? 'current' : 'pending',
      }
    })
  }

  reset() {
    this.currentIndex = 0
    this.errors = 0
    this.totalTyped = 0
    this.startTime = null
    this.endTime = null
    this.isComplete = false
    this.history = []
  }
}
