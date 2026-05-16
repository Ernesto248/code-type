import { LessonEngine } from '../lib/lessonEngine.js'
import { playKeypress, playComplete, playBackspace, isAudioEnabled } from '../sound.js'

/**
 * CodeTypist — the typing interface.
 * Full Monkeytype-style typing experience with complete code blocks.
 */
export function CodeTypist(lesson, { onComplete, onProgress } = {}) {
  const engine = new LessonEngine(lesson.code)

  const container = document.createElement('div')
  container.className = 'h-full flex flex-col slide-in'

  container.innerHTML = `
    <!-- Stats bar -->
    <div class="flex items-center justify-between mb-4 shrink-0">
      <div class="flex items-center gap-4 text-sm">
        <div class="flex items-center gap-1.5">
          <span style="color: var(--text-dim);">⚡</span>
          <span id="wpm-display" class="font-mono font-semibold tabular-nums" style="color: var(--accent);">0</span>
          <span class="text-xs" style="color: var(--text-dim);">wpm</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span style="color: var(--text-dim);">🎯</span>
          <span id="accuracy-display" class="font-mono font-semibold tabular-nums" style="color: var(--success);">100</span>
          <span class="text-xs" style="color: var(--text-dim);">%</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span style="color: var(--text-dim);">📏</span>
          <span id="progress-display" class="font-mono font-semibold tabular-nums" style="color: var(--text);">0/${engine.chars.length}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span style="color: var(--text-dim);">❌</span>
          <span id="errors-display" class="font-mono tabular-nums" style="color: var(--error);">0</span>
        </div>
      </div>
      <button id="reset-typing" class="text-xs transition-colors cursor-pointer" style="color: var(--text-dim);">↻ Reiniciar</button>
    </div>

    <!-- Typing area -->
    <div class="flex-1 flex flex-col min-h-0">
      <div id="typing-area" tabindex="0"
        class="flex-1 min-h-0 p-4 rounded-lg outline-none cursor-text transition-all overflow-y-auto"
        style="background: var(--bg); border: 1px solid var(--border);">
        <div id="chars-container" class="font-mono text-lg leading-relaxed whitespace-pre-wrap">
        </div>
        <div id="ghost" class="font-mono text-lg leading-relaxed" style="color: var(--pending-char);">
          Empieza a escribir...
        </div>
      </div>

      <!-- Progress bar -->
      <div class="mt-3 h-1 rounded-full overflow-hidden shrink-0" style="background: var(--surface-2);">
        <div id="progress-bar" class="h-full rounded-full progress-fill" style="width: 0%; background: linear-gradient(90deg, var(--accent), var(--success));"></div>
      </div>
    </div>

    <!-- Completion overlay -->
    <div id="completion-overlay" class="hidden absolute inset-0 z-10 flex items-center justify-center rounded-xl" style="background: color-mix(in srgb, var(--bg) 90%, transparent); backdrop-filter: blur(8px);">
      <div class="text-center complete-glow p-8 rounded-2xl max-w-sm w-full mx-4" style="background: var(--surface); border: 1px solid color-mix(in srgb, var(--success) 20%, transparent);">
        <div class="text-5xl mb-3">🎉</div>
        <h2 class="text-2xl font-bold mb-1" style="color: var(--text);">¡Completado!</h2>
        <div class="text-sm mb-5" style="color: var(--text-dim);">Lección dominada</div>

        <div class="grid grid-cols-3 gap-3 mb-5">
          <div class="p-3 rounded-xl" style="background: var(--bg); border: 1px solid var(--border);">
            <div class="text-xs" style="color: var(--text-dim);">Velocidad</div>
            <div class="text-xl font-bold font-mono" id="final-wpm" style="color: var(--accent);">0</div>
            <div class="text-xs" style="color: var(--text-dim);">wpm</div>
          </div>
          <div class="p-3 rounded-xl" style="background: var(--bg); border: 1px solid var(--border);">
            <div class="text-xs" style="color: var(--text-dim);">Precisión</div>
            <div class="text-xl font-bold font-mono" id="final-accuracy" style="color: var(--success);">100</div>
            <div class="text-xs" style="color: var(--text-dim);">%</div>
          </div>
          <div class="p-3 rounded-xl" style="background: var(--bg); border: 1px solid var(--border);">
            <div class="text-xs" style="color: var(--text-dim);">Errores</div>
            <div class="text-xl font-bold font-mono" id="final-errors" style="color: var(--error);">0</div>
            <div class="text-xs" style="color: var(--text-dim);">teclas</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-6">
          <div class="p-2.5 rounded-xl text-xs" style="background: var(--bg); border: 1px solid var(--border);">
            <span style="color: var(--text-dim);">⏱️ Tiempo</span>
            <span class="font-mono ml-1" id="final-time" style="color: var(--text);">0s</span>
          </div>
          <div class="p-2.5 rounded-xl text-xs" style="background: var(--bg); border: 1px solid var(--border);">
            <span style="color: var(--text-dim);">📏 Caracteres</span>
            <span class="font-mono ml-1" id="final-chars" style="color: var(--text);">0</span>
          </div>
        </div>

        <button id="next-lesson-btn" class="w-full px-6 py-3 rounded-xl font-semibold text-base transition-all cursor-pointer" style="background: var(--accent); color: white;">
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
  const errorsDisplay = container.querySelector('#errors-display')
  const progressBar = container.querySelector('#progress-bar')
  const typingArea = container.querySelector('#typing-area')
  const ghost = container.querySelector('#ghost')
  const resetBtn = container.querySelector('#reset-typing')
  const completionOverlay = container.querySelector('#completion-overlay')
  const finalWpm = container.querySelector('#final-wpm')
  const finalAccuracy = container.querySelector('#final-accuracy')
  const finalErrors = container.querySelector('#final-errors')
  const finalTime = container.querySelector('#final-time')
  const finalChars = container.querySelector('#final-chars')
  const nextBtn = container.querySelector('#next-lesson-btn')

  let isComplete = false

  function renderChars(charsState) {
    return charsState.map(({ char, state }) => {
      const cls = state === 'current' ? 'typing-char current' :
                  state === 'correct' ? 'typing-char correct' :
                  state === 'incorrect' ? 'typing-char incorrect shake' : 'typing-char pending'
      const display = char === ' ' ? '\u00A0' : char === '\n' ? '↵\n' : char
      return `<span class="${cls}">${escapeHtml(display)}</span>`
    }).join('')
  }

  function updateUI() {
    charsContainer.innerHTML = renderChars(engine.getCharsState())
    ghost.classList.toggle('hidden', engine.currentIndex > 0)
    wpmDisplay.textContent = engine.wpm
    accuracyDisplay.textContent = engine.accuracy
    errorsDisplay.textContent = engine.errors
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
      if (isAudioEnabled()) playBackspace()
      updateUI()
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      const result = engine.type('\n')
      if (result.correct === false) { typingArea.classList.remove('shake'); void typingArea.offsetWidth; typingArea.classList.add('shake') }
      if (isAudioEnabled()) playKeypress(result.correct !== false)
      updateUI()
      if (result.complete) { isComplete = true; showCompletion(); if (onComplete) onComplete(engine) }
      return
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()
      const result = engine.type(e.key)
      if (result.correct === false) { typingArea.classList.remove('shake'); void typingArea.offsetWidth; typingArea.classList.add('shake') }
      if (isAudioEnabled()) playKeypress(result.correct !== false)
      updateUI()
      if (result.complete) { isComplete = true; showCompletion(); if (onComplete) onComplete(engine) }
    }
  }

  function showCompletion() {
    completionOverlay.classList.remove('hidden')
    completionOverlay.classList.add('slide-in')
    if (isAudioEnabled()) playComplete()
    finalWpm.textContent = engine.wpm
    finalAccuracy.textContent = engine.accuracy
    finalErrors.textContent = engine.errors
    finalTime.textContent = `${Math.round(engine.elapsed)}s`
    finalChars.textContent = engine.chars.length
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
