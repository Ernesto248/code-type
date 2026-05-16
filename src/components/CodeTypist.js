import { LessonEngine } from '../lib/lessonEngine.js'

/**
 * CodeTypist component — the core typing interface.
 * Shows the answer code character by character with Monkeytype-style feedback.
 */
export function CodeTypist(lesson, { onComplete, onProgress } = {}) {
  const engine = new LessonEngine(lesson.answer)

  const container = document.createElement('div')
  container.className = 'h-full flex flex-col slide-in'

  container.innerHTML = `
    <!-- Stats bar -->
    <div class="flex items-center justify-between mb-4">
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

    <!-- Snippet preview (read-only, context) -->
    <div class="mb-3 p-3 bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg">
      <pre class="text-sm font-mono text-[#7c7c8a] whitespace-pre-wrap">${escapeHtml(lesson.snippet.replace('███', ''))}</pre>
    </div>

    <!-- Typing target -->
    <div class="flex-1 flex flex-col">
      <div class="text-xs text-[#7c7c8a] mb-2 font-mono">// Escribe el código aquí ↓</div>
      <div 
        id="typing-area"
        tabindex="0"
        class="relative flex-1 p-4 bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff]/30 outline-none cursor-text transition-all"
      >
        <div id="chars-container" class="font-mono text-lg leading-relaxed whitespace-pre-wrap break-all">
          ${renderChars(engine.getCharsState())}
        </div>
        <!-- Ghost text for empty state -->
        <div id="ghost" class="absolute inset-4 font-mono text-lg leading-relaxed text-[#2a2a3e] pointer-events-none ${engine.currentIndex > 0 ? 'hidden' : ''}">
          Empieza a escribir...
        </div>
      </div>

      <!-- Progress bar -->
      <div class="mt-3 h-1 bg-[#1c1c2e] rounded-full overflow-hidden">
        <div id="progress-bar" class="h-full bg-gradient-to-r from-[#6c63ff] to-[#4ade80] rounded-full progress-fill" style="width: 0%"></div>
      </div>
    </div>

    <!-- Completion overlay (hidden initially) -->
    <div id="completion-overlay" class="hidden absolute inset-0 bg-[#0a0a0f]/90 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
      <div class="text-center complete-glow p-8 rounded-2xl border border-[#4ade80]/20">
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

  // ─── Setup typing interaction ───

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

  let isFocused = false
  let inputBuffer = ''
  let isComplete = false

  function renderChars(charsState) {
    return charsState.map(({ char, state }) => {
      const stateClass = state === 'current' ? 'typing-char current' :
                          state === 'correct' ? 'typing-char correct' :
                          state === 'incorrect' ? 'typing-char incorrect shake' : 'typing-char pending'
      const displayChar = char === ' ' ? ' ' : char
      return `<span class="${stateClass}">${escapeHtml(displayChar)}</span>`
    }).join('')
  }

  function updateUI() {
    const state = engine.getCharsState()
    charsContainer.innerHTML = renderChars(state)

    ghost.classList.toggle('hidden', engine.currentIndex > 0)

    wpmDisplay.textContent = engine.wpm
    accuracyDisplay.textContent = engine.accuracy
    progressDisplay.textContent = `${engine.currentIndex}/${engine.chars.length}`

    const pct = engine.chars.length > 0 ? (engine.currentIndex / engine.chars.length) * 100 : 0
    progressBar.style.width = `${pct}%`

    if (onProgress) onProgress(engine)
  }

  function handleKeydown(e) {
    if (isComplete) return

    // Only handle printable keys + backspace
    if (e.key === 'Backspace') {
      e.preventDefault()
      engine.type(null)
      updateUI()
      return
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()
      const result = engine.type(e.key)
      
      if (result.correct === false) {
        // Shake on wrong char
        typingArea.classList.add('shake')
        setTimeout(() => typingArea.classList.remove('shake'), 300)
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
    typingArea.classList.add('complete-glow')
  }

  function resetLesson() {
    engine.reset()
    isComplete = false
    completionOverlay.classList.add('hidden')
    typingArea.classList.remove('complete-glow')
    updateUI()
    typingArea.focus()
  }

  // ─── Event listeners ───

  typingArea.addEventListener('focus', () => { isFocused = true })
  typingArea.addEventListener('blur', () => { isFocused = false })
  typingArea.addEventListener('keydown', handleKeydown)
  typingArea.addEventListener('click', () => typingArea.focus())

  resetBtn.addEventListener('click', resetLesson)

  if (nextBtn && onComplete) {
    nextBtn.addEventListener('click', () => {
      // The parent will handle navigation
      completionOverlay.dispatchEvent(new CustomEvent('next-lesson'))
    })
  }

  // Initial render
  updateUI()

  // Focus on mount
  setTimeout(() => typingArea.focus(), 100)

  return container
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
