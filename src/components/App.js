import { lessons, getNextLesson } from '../lessons/index.js'
import { TheoryPanel } from './TheoryPanel.js'
import { CodeTypist } from './CodeTypist.js'
import { LessonIntro } from './LessonIntro.js'
import { markLessonComplete, getCompletedCount, loadProgress } from '../stores/progress.js'

export function App() {
  const app = document.querySelector('#app')
  app.innerHTML = ''
  app.className = 'h-screen flex flex-col overflow-hidden'

  let currentLessonIndex = 0

  const html = `
    <!-- Floating particles -->
    <div id="particles" class="fixed inset-0 pointer-events-none overflow-hidden z-0"></div>

    <!-- Nav — always visible -->
    <nav class="relative z-10 shrink-0 border-b border-[#2a2a3e] bg-[#0a0a0f]/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-2xl">⌨️</span>
          <span class="font-bold text-lg tracking-tight">Code<span class="text-[#6c63ff]">Type</span></span>
        </div>
        <div class="flex items-center gap-4 text-sm">
          <span class="text-[#7c7c8a]">
            Progreso: <span id="progress-count" class="text-white font-semibold">${getCompletedCount()}/${lessons.length}</span>
          </span>
          <div class="h-4 w-px bg-[#2a2a3e]"></div>
          <span id="module-badge" class="text-xs font-mono text-[#6c63ff] bg-[#6c63ff]/10 px-2.5 py-1 rounded-full border border-[#6c63ff]/20">
            DOM Manipulation
          </span>
        </div>
      </div>
    </nav>

    <!-- Main content — fills remaining space, both panels scroll independently -->
    <main class="relative z-10 flex-1 flex max-w-7xl mx-auto w-full p-6 gap-6 min-h-0 overflow-hidden">
      <!-- Theory panel (left) — scrolls independently -->
      <section id="theory-panel" class="w-[45%] min-w-0 overflow-y-auto bg-[#14141f] border border-[#2a2a3e] rounded-xl p-6 slide-in">
      </section>

      <!-- Vertical divider -->
      <div class="w-px shrink-0 bg-gradient-to-b from-transparent via-[#2a2a3e] to-transparent"></div>

      <!-- Code panel (right) — scrolls independently -->
      <section id="code-panel" class="flex-1 min-w-0 relative bg-[#14141f] border border-[#2a2a3e] rounded-xl p-6 slide-in overflow-hidden" style="animation-delay: 0.1s">
      </section>
    </main>

    <!-- Lesson selector — always visible at bottom -->
    <div id="lesson-selector" class="relative z-10 shrink-0 border-t border-[#2a2a3e] bg-[#0a0a0f]/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto">
        ${lessons.map((l, i) => `
          <button class="lesson-dot px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer whitespace-nowrap
            ${i === currentLessonIndex ? 'bg-[#6c63ff]/20 border-[#6c63ff]/50 text-[#6c63ff]' : 'bg-transparent border-[#2a2a3e] text-[#7c7c8a] hover:border-[#4a4a5e] hover:text-white'}"
            data-index="${i}"
          >
            ${i + 1}. ${l.title.split(' ').slice(0, 3).join(' ')}${l.title.split(' ').length > 3 ? '…' : ''}
          </button>
        `).join('')}
      </div>
    </div>
  `

  app.innerHTML = html

  createParticles()

  // ─── Lesson loader ───

  function renderLesson(index) {
    currentLessonIndex = index
    const lesson = lessons[index]

    // Update dots
    document.querySelectorAll('.lesson-dot').forEach((dot, i) => {
      if (i === index) {
        dot.className = 'lesson-dot px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer whitespace-nowrap bg-[#6c63ff]/20 border-[#6c63ff]/50 text-[#6c63ff]'
      } else {
        dot.className = 'lesson-dot px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer whitespace-nowrap bg-transparent border-[#2a2a3e] text-[#7c7c8a] hover:border-[#4a4a5e] hover:text-white'
      }
    })

    // Module badge
    const badge = document.querySelector('#module-badge')
    if (badge) badge.textContent = lesson.module

    // Theory panel
    const theoryPanel = document.querySelector('#theory-panel')
    theoryPanel.innerHTML = ''
    theoryPanel.classList.remove('slide-in')
    void theoryPanel.offsetWidth
    theoryPanel.classList.add('slide-in')
    theoryPanel.appendChild(TheoryPanel(lesson))

    // Code panel
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
      const nextIdx = lessons.indexOf(next)
      showLesson(nextIdx)
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

  // Start with lesson 0 intro
  showLesson(0)
}

// ─── Particles ───

function createParticles() {
  const container = document.querySelector('#particles')
  if (!container) return

  const colors = ['#6c63ff', '#4ade80', '#f87171', '#60a5fa', '#fbbf24']
  for (let i = 0; i < 30; i++) {
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
