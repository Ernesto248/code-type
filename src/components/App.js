import { lessons, getNextLesson } from '../lessons/index.js'
import { TheoryPanel } from './TheoryPanel.js'
import { CodeTypist } from './CodeTypist.js'
import { LessonIntro } from './LessonIntro.js'
import { markLessonComplete, getCompletedCount, loadProgress } from '../stores/progress.js'
import { themes, initTheme, applyTheme, getSavedTheme } from '../themes.js'
import { toggleAudio, isAudioEnabled, setAudioEnabled } from '../sound.js'
import { updateStreak, getStreak, addXP, getXP, getLevelProgress } from '../stores/streak.js'
import { checkAchievements, getAchievements, ACHIEVEMENTS } from '../stores/achievements.js'
import { recordReview } from '../stores/spacedRep.js'

export function App() {
  const app = document.querySelector('#app')
  app.innerHTML = ''
  app.className = 'h-screen flex flex-col overflow-hidden'

  let currentLessonIndex = 0
  let theoryExpanded = true
  let focusMode = false
  let currentTheme = getSavedTheme()

  initTheme()

  const themeKeys = Object.keys(themes)
  const xp = getXP()
  const streak = getStreak()

  // Get difficulty for current lesson
  function getLessonDifficulty(idx) {
    return lessons[idx]?.difficulty || 'easy'
  }

  // ─── HTML ───

  const html = `
    <div id="particles" class="fixed inset-0 pointer-events-none overflow-hidden z-0"></div>

    <!-- Achievement toast container -->
    <div id="ach-toast" class="fixed top-20 right-6 z-50 flex flex-col gap-2 pointer-events-none"></div>

    <!-- Nav -->
    <nav id="main-nav" class="relative z-10 shrink-0 border-b transition-all duration-300" style="background: color-mix(in srgb, var(--bg) 80%, transparent); border-color: var(--border);">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-2xl">⌨️</span>
          <span class="font-bold text-lg tracking-tight">Code<span style="color: var(--accent);">Type</span></span>
        </div>

        <div class="flex items-center gap-3 text-sm">

          <!-- Focus Mode toggle -->
          <button id="focus-toggle" class="px-2 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer" style="color: var(--text-dim); border-color: var(--border);" title="Focus Mode">
            🚀 Enfocar
          </button>

          <!-- Audio toggle -->
          <button id="audio-toggle" class="text-base px-1.5 transition-colors cursor-pointer" style="color: var(--text-dim);" title="Toggle sound">
            ${isAudioEnabled() ? '🔊' : '🔇'}
          </button>

          <!-- Theme switcher -->
          <div class="flex items-center gap-1 rounded-lg p-0.5" style="background: var(--surface); border: 1px solid var(--border);">
            ${themeKeys.map((key, i) => `
              <button class="theme-btn px-2 py-1.5 text-xs font-mono rounded-md transition-all cursor-pointer whitespace-nowrap
                ${key === currentTheme ? 'active' : ''}"
                style="${key === currentTheme ? `color: var(--accent); background: var(--accent-glow);` : `color: var(--text-dim);`}"
                data-theme="${key}" title="${themes[key].name}">
                ${themes[key].icon} ${i === 1 ? 'Term' : i === 2 ? 'IDE' : 'Dark'}
              </button>
            `).join('')}
          </div>

          <div style="height: 1rem; width: 1px; background: var(--border);"></div>

          <!-- XP + Level -->
          <div class="flex items-center gap-2 font-mono text-xs">
            <span title="Nivel">⬆️ ${xp.level}</span>
            <div class="w-16 h-1.5 rounded-full overflow-hidden" style="background: var(--surface-2);">
              <div class="h-full rounded-full progress-fill" style="width: ${getLevelProgress().progress * 100}%; background: linear-gradient(90deg, var(--accent), var(--success));"></div>
            </div>
          </div>

          <!-- Streak -->
          <span class="font-mono text-xs" style="color: var(--text-dim);" title="Racha">🔥 ${streak.count}</span>

          <div style="height: 1rem; width: 1px; background: var(--border);"></div>

          <span style="color: var(--text-dim);">
            <span id="progress-count" style="color: var(--text); font-weight: 600;">${getCompletedCount()}</span>
            <span class="text-[var(--text-dim)]">/${lessons.length}</span>
          </span>

          <span id="module-badge" class="text-xs font-mono px-2.5 py-1 rounded-full border" style="color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, transparent); border-color: color-mix(in srgb, var(--accent) 20%, transparent);">
            DOM
          </span>
        </div>
      </div>
    </nav>

    <!-- Focus overlay (hidden unless focus mode) -->
    <div id="focus-overlay" class="hidden fixed inset-0 z-20 flex items-center justify-center" style="background: var(--bg);">
      <div class="w-full max-w-4xl mx-auto px-8">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3 text-sm">
            <span class="font-mono" style="color: var(--accent);">⚡ <span id="focus-wpm">0</span> wpm</span>
            <span style="color: var(--text-dim);">🎯 <span id="focus-accuracy">100</span>%</span>
            <span style="color: var(--text-dim);">📏 <span id="focus-progress">0/0</span></span>
          </div>
          <button id="focus-exit" class="text-xs font-mono px-3 py-1.5 rounded-lg border transition-all cursor-pointer" style="color: var(--text-dim); border-color: var(--border);">
            ✕ Salir
          </button>
        </div>
        <div id="focus-typing-area" class="w-full min-h-[300px]"></div>
      </div>
    </div>

    <!-- Main content -->
    <main id="main-content" class="relative z-10 flex-1 flex max-w-7xl mx-auto w-full p-6 gap-0 min-h-0 overflow-hidden transition-all duration-300">

      <div id="theory-wrap" class="relative flex items-stretch transition-all duration-300 ease-in-out" style="width: ${theoryExpanded ? '45%' : '0px'}; min-width: ${theoryExpanded ? '280px' : '0px'};">
        <section id="theory-panel" class="flex-1 min-w-0 overflow-y-auto rounded-xl p-6 slide-in transition-all duration-300 ease-in-out ${theoryExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}" style="background: var(--surface); border: 1px solid var(--border);">
        </section>

        <button id="theory-toggle" class="absolute -right-3 top-6 z-20 w-6 h-10 flex items-center justify-center rounded-r-lg transition-all duration-200 group cursor-pointer" style="background: var(--surface); border: 1px solid var(--border); border-left: none;">
          <span id="theory-chevron" class="text-xs select-none" style="color: var(--text-dim);">${theoryExpanded ? '◀' : '▶'}</span>
        </button>
      </div>

      <div class="shrink-0 transition-all duration-300 ease-in-out" style="width: ${theoryExpanded ? '24px' : '0px'}"></div>
      <div class="w-px shrink-0 transition-all duration-300 ease-in-out ${theoryExpanded ? 'opacity-100' : 'opacity-0'}" style="background: linear-gradient(to bottom, transparent, var(--border), transparent);"></div>
      <div class="shrink-0 transition-all duration-300 ease-in-out" style="width: ${theoryExpanded ? '24px' : '0px'}"></div>

      <section id="code-panel" class="flex-1 min-w-0 relative rounded-xl p-6 slide-in overflow-hidden transition-all duration-300 ease-in-out" style="animation-delay: 0.1s; background: var(--surface); border: 1px solid var(--border);">
      </section>
    </main>

    <!-- Lesson selector -->
    <div id="lesson-selector" class="relative z-10 shrink-0 border-t transition-all duration-300" style="background: color-mix(in srgb, var(--bg) 80%, transparent); border-color: var(--border);">
      <div class="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto">
        ${lessons.map((l, i) => `
          <button class="lesson-dot px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer whitespace-nowrap" data-index="${i}"
            style="${i === currentLessonIndex
              ? 'background: color-mix(in srgb, var(--accent) 20%, transparent); border-color: color-mix(in srgb, var(--accent) 50%, transparent); color: var(--accent);'
              : 'background: transparent; border-color: var(--border); color: var(--text-dim);'}">
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
        b.style.cssText = `color: var(--text-dim); background: transparent;`
      })
      btn.style.cssText = `color: var(--accent); background: var(--accent-glow);`
    })
  })

  // ─── Audio toggle ───

  document.querySelector('#audio-toggle')?.addEventListener('click', () => {
    const enabled = toggleAudio()
    document.querySelector('#audio-toggle').textContent = enabled ? '🔊' : '🔇'
  })

  // ─── Focus Mode ───

  let focusTypistRef = null

  function enterFocusMode() {
    focusMode = true
    document.getElementById('focus-overlay').classList.remove('hidden')
    document.getElementById('main-nav').classList.add('opacity-0', 'pointer-events-none')
    document.getElementById('lesson-selector').classList.add('opacity-0', 'pointer-events-none')
    document.getElementById('main-content').classList.add('opacity-0', 'pointer-events-none')
    document.getElementById('particles').style.display = 'none'

    // Rebuild typist in focus area if needed
    const focusArea = document.getElementById('focus-typing-area')
    focusArea.innerHTML = ''
    if (focusTypistRef) {
      focusArea.appendChild(focusTypistRef)
    }
  }

  function exitFocusMode() {
    focusMode = false
    document.getElementById('focus-overlay').classList.add('hidden')
    document.getElementById('main-nav').classList.remove('opacity-0', 'pointer-events-none')
    document.getElementById('lesson-selector').classList.remove('opacity-0', 'pointer-events-none')
    document.getElementById('main-content').classList.remove('opacity-0', 'pointer-events-none')
    document.getElementById('particles').style.display = ''
  }

  document.querySelector('#focus-toggle')?.addEventListener('click', () => {
    if (focusMode) {
      exitFocusMode()
    } else {
      enterFocusMode()
    }
  })

  document.querySelector('#focus-exit')?.addEventListener('click', exitFocusMode)

  // ─── Theory toggle ───

  function toggleTheory() {
    theoryExpanded = !theoryExpanded
    const wrap = document.querySelector('#theory-wrap')
    const panel = document.querySelector('#theory-panel')
    const chevron = document.querySelector('#theory-chevron')
    const gaps = document.querySelectorAll('.shrink-0[style*="width"]')
    const divider = document.querySelector('.w-px.shrink-0')

    if (wrap) { wrap.style.width = theoryExpanded ? '45%' : '0px'; wrap.style.minWidth = theoryExpanded ? '280px' : '0px' }
    if (panel) { panel.classList.toggle('opacity-0', !theoryExpanded); panel.classList.toggle('pointer-events-none', !theoryExpanded) }
    if (chevron) chevron.textContent = theoryExpanded ? '◀' : '▶'
    gaps.forEach(g => { g.style.width = theoryExpanded ? '24px' : '0px' })
    if (divider) { divider.classList.toggle('opacity-100', theoryExpanded); divider.classList.toggle('opacity-0', !theoryExpanded) }
  }

  document.querySelector('#theory-toggle')?.addEventListener('click', toggleTheory)

  // ─── Achievement toast ───

  function showAchievementToast(achId) {
    const ach = ACHIEVEMENTS.find(a => a.id === achId)
    if (!ach) return
    const container = document.querySelector('#ach-toast')
    const toast = document.createElement('div')
    toast.className = 'slide-in px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 text-sm pointer-events-auto'
    toast.style.cssText = `background: var(--surface); border-color: var(--accent); max-width: 320px;`
    toast.innerHTML = `
      <span class="text-2xl">${ach.icon}</span>
      <div>
        <div class="font-semibold" style="color: var(--accent);">¡Logro desbloqueado!</div>
        <div style="color: var(--text-dim);">${ach.title} — ${ach.desc}</div>
      </div>
    `
    container.appendChild(toast)
    setTimeout(() => {
      toast.style.opacity = '0'
      toast.style.transition = 'opacity 0.3s'
      setTimeout(() => toast.remove(), 300)
    }, 4000)
  }

  // ─── Lesson loader ───

  function renderLesson(index) {
    currentLessonIndex = index
    const lesson = lessons[index]

    // Dots
    document.querySelectorAll('.lesson-dot').forEach((dot, i) => {
      const isActive = i === index
      dot.style.cssText = isActive
        ? 'background: color-mix(in srgb, var(--accent) 20%, transparent); border-color: color-mix(in srgb, var(--accent) 50%, transparent); color: var(--accent);'
        : 'background: transparent; border-color: var(--border); color: var(--text-dim);'
    })

    // Badge
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
        const difficulty = getLessonDifficulty(index)
        const streak = updateStreak()
        const xpResult = addXP(difficulty, focusMode ? 25 : 0)
        const progressCount = getCompletedCount()
        const moduleComplete = lessons.filter(l => l.module === lesson.module).every(l => loadProgress()[l.id]?.completed)

        markLessonComplete(lesson.id, {
          wpm: engine.wpm,
          accuracy: engine.accuracy,
          time: engine.elapsed,
          errors: engine.errors,
          difficulty,
        })

        // Record for spaced repetition (auto-quality based on accuracy)
        const repQuality = engine.accuracy >= 95 ? 5 : engine.accuracy >= 80 ? 4 : engine.accuracy >= 60 ? 3 : 2
        recordReview(lesson.id, repQuality)

        // Check achievements
        const newAch = checkAchievements({
          lessonsCompleted: progressCount + 1,
          accuracy: engine.accuracy,
          wpm: engine.wpm,
          difficulty,
          streak: streak.count,
          level: xpResult.level,
          moduleComplete,
          focusMode,
        })

        newAch.forEach(id => showAchievementToast(id))

        // Show level up
        if (xpResult.leveledUp) {
          setTimeout(() => {
            const toast = document.createElement('div')
            toast.className = 'slide-in px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 text-sm pointer-events-auto'
            toast.style.cssText = `background: var(--surface); border-color: var(--success); max-width: 320px;`
            toast.innerHTML = `
              <span class="text-2xl">⬆️</span>
              <div>
                <div class="font-semibold" style="color: var(--success);">¡Subiste al nivel ${xpResult.level}!</div>
                <div style="color: var(--text-dim);">Sigue así 🔥</div>
              </div>
            `
            document.querySelector('#ach-toast').appendChild(toast)
            setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300) }, 4000)
          }, 1500)
        }

        // Update nav
        const count = document.querySelector('#progress-count')
        if (count) count.textContent = `${getCompletedCount()}`
        document.querySelectorAll('[title="Nivel"]').forEach(el => { if (el) el.textContent = `⬆️ ${xpResult.level}` })
      },
      onProgress(engine) {
        // Update focus mode stats if active
        if (focusMode) {
          document.querySelector('#focus-wpm').textContent = engine.wpm
          document.querySelector('#focus-accuracy').textContent = engine.accuracy
          document.querySelector('#focus-progress').textContent = `${engine.currentIndex}/${engine.chars.length}`
        }
      }
    })

    // Store ref for focus mode
    focusTypistRef = typist
    if (focusMode) {
      document.querySelector('#focus-typing-area').innerHTML = ''
      document.querySelector('#focus-typing-area').appendChild(typist)
    } else {
      codePanel.appendChild(typist)
    }

    typist.addEventListener('next-lesson', () => goNext())
  }

  function showLesson(index) {
    const lesson = lessons[index]
    if (focusMode) exitFocusMode()
    LessonIntro(lesson, () => renderLesson(index))
  }

  function goNext() {
    const next = getNextLesson(lessons[currentLessonIndex].id)
    if (next) showLesson(lessons.indexOf(next))
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

function createParticles() {
  const container = document.querySelector('#particles')
  if (!container) return
  const colors = ['#6c63ff', '#4ade80', '#f87171', '#60a5fa', '#fbbf24']
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div')
    const size = Math.random() * 4 + 2
    p.className = 'floating-particle'
    p.style.cssText = `width:${size}px;height:${size}px;background:${colors[i%5]};left:${Math.random()*100}%;animation-duration:${Math.random()*20+15}s;animation-delay:${Math.random()*-20}s;opacity:${Math.random()*0.1+0.05};`
    container.appendChild(p)
  }
}
