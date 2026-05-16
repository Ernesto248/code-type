import { LessonEngine } from '../lib/lessonEngine.js'

/**
 * CodeTypist — the typing interface.
 * Shows the answer code character by character with Monkeytype-style feedback.
 */
export function CodeTypist(lesson, { onComplete, onProgress } = {}) {
  const engine = new LessonEngine(lesson.answer)

  const container = document.createElement('div')
  container.className = 'h-full flex flex-col slide-in'

  container.innerHTML = `
    <!-- Stats bar -->
    <div class="flex items-center justify-between mb-4 shrink-0">
      <div class="flex items-center gap-4 text-sm">
        <div class="flex items-center gap-1.5">
          <span class="text-[#7c7c8a]">⚡</span>
          <span id="wpm-display" class="font-mono text-[#6c63ff] font-semibold tabular-nums">0</span>
          <span class="text-[#7c7c8a] text-xs">wpm</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-[#7c7c8a]">🎯</span>
          <span id="accuracy-display" class="font-mono text-[#4ade80] font-semibold tabular-nums">100</span>
          <span class="text-[#7c7c8a] text-xs">%</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-[#7c7c8a]">📏</span>
          <span id="progress-display" class="font-mono text-[#e1e1e6] font-semibold tabular-nums">0/${engine.chars.length}</span>
        </div>
      </div>
      <button id="reset-typing" class="text-xs text-[#7c7c8a] hover:text-[#f87171] transition-colors cursor-pointer">
        ↻ Reiniciar
      </button>
    </div>

    </div>

    <!-- Typing area — flex-grows to fill space -->
    <div class="flex-1 flex flex-col min-h-0">
      <div class="text-xs text-[#7c7c8a] mb-2 font-mono shrink-0">// Escribe el código aquí:</div>
      <div 
        id="typing-area"
        tabindex="0"
        class="flex-1 min-h-0 p-4 bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff]/30 outline-none cursor-text transition-all overflow-y-auto"
      >
        <div id="chars-container" class="font-mono text-lg leading-relaxed whitespace-pre-wrap">
          ${renderChars(engine.getCharsState())}
        </div>
        <div id="ghost" class="font-mono text-lg leading-relaxed text-[#2a2a3e] ${engine.currentIndex > 0 ? 'hidden' : ''}">
          Empieza a escribir...
        </div>
      </div>

      <!-- Progress bar -->
      <div class="mt-3 h-1 bg-[#1c1c2e] rounded-full overflow-hidden shrink-0">
        <div id="progress-bar" class="h-full bg-gradient-to-r from-[#6c63ff] to-[#4ade80] rounded-full progress-fill" style="width: 0%"></div>
      </div>
    </div>

    <!-- Completion overlay -->
    <div id="completion-overlay" class="hidden absolute inset-0 bg-[#0a0a0f]/90 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
      <div class="text-center complete-glow p-8 rounded-2xl border border-[#4ade80]/20 bg-[#14141f]">
        <div class="text-5xl mb-4">🎉</div>
        <h2 class="text-2xl font-bold text-white mb-2">¡Completado!</h2>
        <div class="flex items-center justify-center gap-6 text-sm font-mono">
          <div>
            <span class="text-[#6c63ff] text-xl font-bold" id="final-wpm">0</span>
            <span class="text-[#7c7c8a]"> wpm</span>
          </div>
          <div>
            <span class="text-[#4ade80] text-xl font-bold" id="final-accuracy">100</span>
            <span class="text-[#7c7c8a]">%</span>
          </div>
          <div>
            <span class="text-[#e1e1e6] text-xl font-bold" id="final-time">0s</span>
          </div>
        </div>
        <button id="next-lesson-btn" class="mt-6 px-6 py-2.5 bg-[#6c63ff] hover:bg-[#5a52e0] text-white rounded-lg font-medium transition-all cursor-pointer">
          Siguiente lección →
        </button>
      </div>
    </div>
  `

  // ─── Setup ───

  const charsContainer = container.querySelector('#chars-container')
  const wpmDisplay = container.querySelector('#wpm-display')
  const accuracyDisplay = container.querySelector('#accuracy-display')
  const progressDisplay = container.querySelector('#progress-display')
  const progressBar = container.querySelector('#progress-bar')
  const typingArea = container.querySelector('#typing-area')
  const ghost = container.querySelector('#ghost')
  const resetBtn = container.querySelector('#reset-typing')
  const completionOverlay = container.querySelector('#completion-overlay')
  const finalWpm = container.querySelector('#final-wpm')
  const finalAccuracy = container.querySelector('#final-accuracy')
  const finalTime = container.querySelector('#final-time')
  const nextBtn = container.querySelector('#next-lesson-btn')

  let isComplete = false


  function renderChars(charsState) {
    return charsState.map(({ char, state }) => {
      const cls = state === 'current' ? 'typing-char current' :
                  state === 'correct' ? 'typing-char correct' :
                  state === 'incorrect' ? 'typing-char incorrect shake' : 'typing-char pending'
      const display = char === ' ' ? '\u00A0' : char // non-breaking space for visibility
      return `<span class="${cls}">${escapeHtml(display)}</span>`
    }).join('')
  }

  function updateUI() {
    charsContainer.innerHTML = renderChars(engine.getCharsState())
    ghost.classList.toggle('hidden', engine.currentIndex > 0)
    wpmDisplay.textContent = engine.wpm
    accuracyDisplay.textContent = engine.accuracy
    progressDisplay.textContent = `${engine.currentIndex}/${engine.chars.length}`
    const pct = engine.chars.length > 0 ? (engine.currentIndex / engine.chars.length) * 100 : 0
    progressBar.style.width = `${Math.min(pct, 100)}%`
    if (onProgress) onProgress(engine)
  }

  function handleKeydown(e) {
    if (isComplete) return

    if (e.key === 'Backspace') {
      e.preventDefault()
      engine.type(null)
      updateUI()
      return
    }

    // Enter key for multi-line answers
    if (e.key === 'Enter') {
      e.preventDefault()
      const result = engine.type('\n')

      if (result.correct === false) {
        typingArea.classList.remove('shake')
        void typingArea.offsetWidth
        typingArea.classList.add('shake')
      }

      updateUI()

      if (result.complete) {
        isComplete = true
        showCompletion()
        if (onComplete) onComplete(engine)
      }
      return
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()
      const result = engine.type(e.key)

      if (result.correct === false) {
        typingArea.classList.remove('shake')
        void typingArea.offsetWidth
        typingArea.classList.add('shake')
      }

      updateUI()

      if (result.complete) {
        isComplete = true
        showCompletion()
        if (onComplete) onComplete(engine)
      }
    }
  }

  function showCompletion() {
    completionOverlay.classList.remove('hidden')
    completionOverlay.classList.add('slide-in')
    finalWpm.textContent = engine.wpm
    finalAccuracy.textContent = engine.accuracy
    finalTime.textContent = `${Math.round(engine.elapsed)}s`
  }

  function resetLesson() {
    engine.reset()
    isComplete = false
    completionOverlay.classList.add('hidden')
    updateUI()
    typingArea.focus()
  }

  // ─── Events ───

  typingArea.addEventListener('keydown', handleKeydown)
  typingArea.addEventListener('click', () => typingArea.focus())

  resetBtn.addEventListener('click', resetLesson)

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      container.dispatchEvent(new CustomEvent('next-lesson', { bubbles: true }))
    })
  }

  updateUI()
  setTimeout(() => typingArea.focus(), 100)

  return container
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
