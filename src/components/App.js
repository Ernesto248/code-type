import { lessons, getNextLesson } from '../lessons/index.js'
import { TheoryPanel } from './TheoryPanel.js'
import { CodeTypist } from './CodeTypist.js'
import { LessonIntro } from './LessonIntro.js'
import { markLessonComplete, getCompletedCount, loadProgress } from '../stores/progress.js'
import { themes, initTheme, applyTheme, getSavedTheme } from '../themes.js'
import { toggleAudio, isAudioEnabled, setAudioEnabled } from '../sound.js'

export function App() {
  const app = document.querySelector('#app')
  app.innerHTML = ''
  app.className = 'h-screen flex flex-col overflow-hidden'

  let currentLessonIndex = 0
  let theoryExpanded = true
  let currentTheme = getSavedTheme()

  // Init theme
  initTheme()

  const themeKeys = Object.keys(themes)

  const html = `
    <!-- Floating particles -->
    <div id="particles" class="fixed inset-0 pointer-events-none overflow-hidden z-0"></div>

    <!-- Nav -->
    <nav class="relative z-10 shrink-0 border-b border-[#2a2a3e] bg-[#0a0a0f]/80 backdrop-blur-md" style="border-color: var(--border); background: color-mix(in srgb, var(--bg) 80%, transparent);">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-2xl">⌨️</span>
          <span class="font-bold text-lg tracking-tight">Code<span class="text-[#6c63ff]" style="color: var(--accent) !important;">Type</span></span>
        </div>

        <div class="flex items-center gap-3 text-sm">
          <!-- Audio toggle -->
          <button id="audio-toggle" class="audio-toggle text-[var(--text-dim)] hover:text-[var(--text)] transition-colors cursor-pointer text-base px-1.5" title="Toggle sound">
            ${isAudioEnabled() ? '🔊' : '🔇'}
          </button>

          <!-- Theme switcher -->
          <div class="flex items-center gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-0.5">
            ${themeKeys.map((key, i) => `
              <button class="theme-btn px-2 py-1.5 text-xs font-mono rounded-md transition-all cursor-pointer whitespace-nowrap
                ${key === currentTheme ? 'active text-[var(--accent)]' : 'text-[var(--text-dim)] hover:text-[var(--text)]'}"
                data-theme="${key}"
                title="${themes[key].name}"
              >
                ${themes[key].icon} ${i === 1 ? 'Terminal' : i === 2 ? 'IDE' : 'Dark'}
              </button>
            `).join('')}
          </div>

          <div class="h-4 w-px" style="background: var(--border);"></div>
          <span class="text-[var(--text-dim)]">
            Progreso: <span id="progress-count" class="text-[var(--text)] font-semibold">${getCompletedCount()}/${lessons.length}</span>
          </span>
          <div class="h-4 w-px" style="background: var(--border);"></div>
          <span id="module-badge" class="text-xs font-mono px-2.5 py-1 rounded-full border" style="color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, transparent); border-color: color-mix(in srgb, var(--accent) 20%, transparent);">
            DOM Manipulation
          </span>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="relative z-10 flex-1 flex max-w-7xl mx-auto w-full p-6 gap-0 min-h-0 overflow-hidden">
      <!-- Theory panel — collapsible sidebar -->
      <div class="relative flex items-stretch transition-all duration-300 ease-in-out" style="width: ${theoryExpanded ? '45%' : '0px'}; min-width: ${theoryExpanded ? '280px' : '0px'};">
        <section id="theory-panel" class="flex-1 min-w-0 overflow-y-auto rounded-xl p-6 slide-in transition-all duration-300 ease-in-out ${theoryExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}" style="background: var(--surface); border: 1px solid var(--border);">
        </section>

        <!-- Collapse toggle -->
        <button id="theory-toggle"
          class="absolute -right-3 top-6 z-20 w-6 h-10 flex items-center justify-center rounded-r-lg transition-all duration-200 group cursor-pointer"
          style="background: var(--surface); border: 1px solid var(--border); border-left: none;"
        >
          <span id="theory-chevron" class="text-xs select-none" style="color: var(--text-dim);">
            ${theoryExpanded ? '◀' : '▶'}
          </span>
        </button>
      </div>

      <div class="shrink-0 transition-all duration-300 ease-in-out" style="width: ${theoryExpanded ? '24px' : '0px'}"></div>
      <div class="w-px shrink-0 transition-all duration-300 ease-in-out ${theoryExpanded ? 'opacity-100' : 'opacity-0'}" style="background: linear-gradient(to bottom, transparent, var(--border), transparent);"></div>
      <div class="shrink-0 transition-all duration-300 ease-in-out" style="width: ${theoryExpanded ? '24px' : '0px'}"></div>

      <!-- Code panel -->
      <section id="code-panel" class="flex-1 min-w-0 relative rounded-xl p-6 slide-in overflow-hidden transition-all duration-300 ease-in-out" style="animation-delay: 0.1s; background: var(--surface); border: 1px solid var(--border);">
      </section>
    </main>

    <!-- Lesson selector -->
    <div id="lesson-selector" class="relative z-10 shrink-0 border-t" style="background: color-mix(in srgb, var(--bg) 80%, transparent); border-color: var(--border);">
      <div class="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto">
        ${lessons.map((l, i) => `
          <button class="lesson-dot px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer whitespace-nowrap
            ${i === currentLessonIndex ? 'bg-[var(--accent)]/20 border-[var(--accent)]/50 text-[var(--accent)]' : 'bg-transparent border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--text-dim)] hover:text-[var(--text)]'}"
            data-index="${i}"
            style="border-color: ${i === currentLessonIndex ? 'color-mix(in srgb, var(--accent) 50%, transparent)' : 'var(--border)'}; ${i === currentLessonIndex ? `background: color-mix(in srgb, var(--accent) 20%, transparent); color: var(--accent)` : ''}"
          >
            ${i + 1}. ${l.title.split(' ').slice(0, 3).join(' ')}${l.title.split(' ').length > 3 ? '…' : ''}
          </button>
        `).join('')}
      </div>
    </div>
  `

  app.innerHTML = html

  createParticles()

  // ─── Theme switcher ───

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme
      applyTheme(theme)
      currentTheme = theme

      document.querySelectorAll('.theme-btn').forEach(b => {
        b.classList.remove('active')
        b.style.color = 'var(--text-dim)'
      })
      btn.classList.add('active')
      btn.style.color = 'var(--accent)'
    })
  })

  // ─── Audio toggle ───

  const audioBtn = document.querySelector('#audio-toggle')
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const enabled = toggleAudio()
      audioBtn.textContent = enabled ? '🔊' : '🔇'
    })
  }

  // ─── Theory panel toggle ───

  function toggleTheory() {
    theoryExpanded = !theoryExpanded
    const theoryWrap = document.querySelector('.relative.flex.items-stretch')
    const theoryPanel = document.querySelector('#theory-panel')
    const chevron = document.querySelector('#theory-chevron')
    const gaps = document.querySelectorAll('.shrink-0[style*="width"]')
    const divider = document.querySelector('.w-px.shrink-0')

    if (theoryWrap) {
      theoryWrap.style.width = theoryExpanded ? '45%' : '0px'
      theoryWrap.style.minWidth = theoryExpanded ? '280px' : '0px'
    }
    if (theoryPanel) {
      if (theoryExpanded) {
        theoryPanel.classList.remove('opacity-0', 'pointer-events-none')
        theoryPanel.classList.add('opacity-100')
      } else {
        theoryPanel.classList.remove('opacity-100')
        theoryPanel.classList.add('opacity-0', 'pointer-events-none')
      }
    }
    if (chevron) chevron.textContent = theoryExpanded ? '◀' : '▶'
    gaps.forEach(g => { g.style.width = theoryExpanded ? '24px' : '0px' })
    if (divider) {
      if (theoryExpanded) {
        divider.classList.remove('opacity-0')
        divider.classList.add('opacity-100')
      } else {
        divider.classList.remove('opacity-100')
        divider.classList.add('opacity-0')
      }
    }
  }

  document.querySelector('#theory-toggle')?.addEventListener('click', toggleTheory)

  // ─── Lesson loader ───

  function renderLesson(index) {
    currentLessonIndex = index
    const lesson = lessons[index]

    document.querySelectorAll('.lesson-dot').forEach((dot, i) => {
      if (i === index) {
        dot.style.cssText = `background: color-mix(in srgb, var(--accent) 20%, transparent); border-color: color-mix(in srgb, var(--accent) 50%, transparent); color: var(--accent);`
      } else {
        dot.style.cssText = `background: transparent; border-color: var(--border); color: var(--text-dim);`
      }
    })

    const badge = document.querySelector('#module-badge')
    if (badge) badge.textContent = lesson.module

    const theoryPanel = document.querySelector('#theory-panel')
    theoryPanel.innerHTML = ''
    theoryPanel.classList.remove('slide-in')
    void theoryPanel.offsetWidth
    theoryPanel.classList.add('slide-in')
    theoryPanel.appendChild(TheoryPanel(lesson))

    const codePanel = document.querySelector('#code-panel')
    codePanel.innerHTML = ''
    codePanel.classList.remove('slide-in')
    void codePanel.offsetWidth
    codePanel.classList.add('slide-in')

    const typist = CodeTypist(lesson, {
      onComplete(engine) {
        markLessonComplete(lesson.id, {
          wpm: engine.wpm,
          accuracy: engine.accuracy,
          time: engine.elapsed,
        })
        updateProgress()
      },
    })

    codePanel.appendChild(typist)
    typist.addEventListener('next-lesson', () => goNext())
  }

  function showLesson(index) {
    const lesson = lessons[index]
    LessonIntro(lesson, () => renderLesson(index))
  }

  function goNext() {
    const next = getNextLesson(lessons[currentLessonIndex].id)
    if (next) {
      showLesson(lessons.indexOf(next))
    }
  }

  function updateProgress() {
    const count = document.querySelector('#progress-count')
    if (count) count.textContent = `${getCompletedCount()}/${lessons.length}`
  }

  // ─── Dot click navigation ───

  document.querySelectorAll('.lesson-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index)
      if (idx !== currentLessonIndex) showLesson(idx)
    })
  })

  showLesson(0)
}

// ─── Particles ───

function createParticles() {
  const container = document.querySelector('#particles')
  if (!container) return

  const colors = ['#6c63ff', '#4ade80', '#f87171', '#60a5fa', '#fbbf24']
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div')
    const size = Math.random() * 4 + 2
    p.className = 'floating-particle'
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      background: ${colors[i % colors.length]};
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 20 + 15}s;
      animation-delay: ${Math.random() * -20}s;
      opacity: ${Math.random() * 0.1 + 0.05};
    `
    container.appendChild(p)
  }
}
