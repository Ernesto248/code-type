import { lessons, getNextLesson, getLessonsByModule, getModules } from '../lessons/index.js'
import { TheoryPanel } from './TheoryPanel.js'
import { CodeTypist } from './CodeTypist.js'
import { LessonIntro } from './LessonIntro.js'
import { HomePage } from './HomePage.js'
import { markLessonComplete, getCompletedCount, loadProgress } from '../stores/progress.js'
import { themes, initTheme, applyTheme, getSavedTheme } from '../themes.js'
import { toggleAudio, isAudioEnabled } from '../sound.js'
import { updateStreak, getStreak, addXP, getXP, getLevelProgress } from '../stores/streak.js'
import { checkAchievements, ACHIEVEMENTS } from '../stores/achievements.js'
import { recordReview } from '../stores/spacedRep.js'

export function App() {
  initTheme()

  const app = document.querySelector('#app')
  app.innerHTML = ''

  let state = { view: 'home', module: null, lessonIndex: 0 }
  let focusMode = false
  let currentTheme = getSavedTheme()

  const themeKeys = Object.keys(themes)
  const modules = getModules()

  function render() {
    if (state.view === 'home') {
      renderHome()
    } else {
      renderModule()
    }
  }

  // ─── HOME ───

  function renderHome() {
    app.innerHTML = ''
    app.className = ''
    app.style.background = 'var(--bg)'

    const particleWrapper = document.createElement('div')
    particleWrapper.id = 'particles'
    particleWrapper.className = 'fixed inset-0 pointer-events-none overflow-hidden z-0'
    app.appendChild(particleWrapper)
    createParticles()

    const nav = document.createElement('nav')
    nav.className = 'relative z-10 shrink-0 border-b'
    nav.style.cssText = `background: color-mix(in srgb, var(--bg) 80%, transparent); border-color: var(--border);`
    nav.innerHTML = `
      <div class="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <span class="font-bold text-lg tracking-tight" style="color: var(--text);">⌨️ Code<span style="color: var(--accent);">Type</span></span>
        <div class="flex items-center gap-2">
          ${themeKeys.map((key, i) => `
            <button class="theme-btn px-2 py-1.5 text-xs font-mono rounded-md transition-all cursor-pointer"
              style="${key === currentTheme ? `color: var(--accent); background: var(--accent-glow);` : `color: var(--text-dim);`}"
              data-theme="${key}">${themes[key].icon}</button>
          `).join('')}
          <button id="audio-toggle" class="px-2 text-base cursor-pointer" style="color: var(--text-dim);">
            ${isAudioEnabled() ? '🔊' : '🔇'}
          </button>
        </div>
      </div>
    `
    app.appendChild(nav)

    const homePage = HomePage({
      onSelectModule(mod) {
        state = { view: 'module', module: mod, lessonIndex: 0 }
        render()
      }
    })
    app.appendChild(homePage)

    // Theme toggle in home
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

    document.querySelector('#audio-toggle')?.addEventListener('click', () => {
      toggleAudio()
      document.querySelector('#audio-toggle').textContent = isAudioEnabled() ? '🔊' : '🔇'
    })
  }

  // ─── MODULE VIEW ───

  function renderModule() {
    const moduleLessons = getLessonsByModule(state.module)
    if (moduleLessons.length === 0) { state = { view: 'home', module: null, lessonIndex: 0 }; renderHome(); return }

    app.innerHTML = ''
    app.className = 'h-screen flex flex-col overflow-hidden'
    app.style.background = ''

    const xp = getXP()
    const streak = getStreak()

    const particleWrapper = document.createElement('div')
    particleWrapper.id = 'particles'
    particleWrapper.className = 'fixed inset-0 pointer-events-none overflow-hidden z-0'
    app.appendChild(particleWrapper)
    createParticles()

    // Achievement toast container
    const achContainer = document.createElement('div')
    achContainer.id = 'ach-toast'
    achContainer.className = 'fixed top-20 right-6 z-50 flex flex-col gap-2 pointer-events-none'
    app.appendChild(achContainer)

    // Focus overlay
    const focusOverlay = document.createElement('div')
    focusOverlay.id = 'focus-overlay'
    focusOverlay.className = 'hidden fixed inset-0 z-20 flex items-center justify-center'
    focusOverlay.style.background = 'var(--bg)'
    focusOverlay.innerHTML = `
      <div class="w-full max-w-4xl mx-auto px-8">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3 text-sm">
            <span class="font-mono" style="color: var(--accent);">⚡ <span id="focus-wpm">0</span> wpm</span>
            <span style="color: var(--text-dim);">🎯 <span id="focus-accuracy">100</span>%</span>
            <span style="color: var(--text-dim);">📏 <span id="focus-progress">0/0</span></span>
          </div>
          <button id="focus-exit" class="text-xs font-mono px-3 py-1.5 rounded-lg border cursor-pointer" style="color: var(--text-dim); border-color: var(--border);">✕ Salir</button>
        </div>
        <div id="focus-typing-area" class="w-full min-h-[300px]"></div>
      </div>
    `
    app.appendChild(focusOverlay)

    // Nav
    const nav = document.createElement('nav')
    nav.id = 'main-nav'
    nav.className = 'relative z-10 shrink-0 border-b transition-all duration-300'
    nav.style.cssText = `background: color-mix(in srgb, var(--bg) 80%, transparent); border-color: var(--border);`
    nav.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button id="home-btn" class="text-sm cursor-pointer" style="color: var(--text-dim);">← Inicio</button>
          <span style="color: var(--border);">/</span>
          <span class="font-semibold" style="color: var(--text);">${state.module}</span>
        </div>
        <div class="flex items-center gap-3 text-sm">
          <button id="focus-toggle" class="px-2 py-1.5 rounded-lg border text-xs font-mono cursor-pointer" style="color: var(--text-dim); border-color: var(--border);">🚀 Enfocar</button>
          <button id="audio-toggle" class="text-base px-1.5 cursor-pointer" style="color: var(--text-dim);">${isAudioEnabled() ? '🔊' : '🔇'}</button>
          <div class="flex items-center gap-1 rounded-lg p-0.5" style="background: var(--surface); border: 1px solid var(--border);">
            ${themeKeys.map((key) => `
              <button class="theme-btn px-2 py-1.5 text-xs font-mono rounded-md cursor-pointer"
                style="${key === currentTheme ? `color: var(--accent); background: var(--accent-glow);` : `color: var(--text-dim);`}"
                data-theme="${key}">${themes[key].icon}</button>
            `).join('')}
          </div>
          <div style="height: 1rem; width: 1px; background: var(--border);"></div>
          <div class="flex items-center gap-2 font-mono text-xs">
            <span title="Nivel" style="color: var(--text);">⬆️ ${xp.level}</span>
            <div class="w-16 h-1.5 rounded-full overflow-hidden" style="background: var(--surface-2);">
              <div class="h-full rounded-full progress-fill" style="width: ${getLevelProgress().progress * 100}%; background: linear-gradient(90deg, var(--accent), var(--success));"></div>
            </div>
          </div>
          <span class="font-mono text-xs" style="color: var(--text-dim);">🔥 ${streak.count}</span>
          <div style="height: 1rem; width: 1px; background: var(--border);"></div>
          <span style="color: var(--text-dim);"><span id="progress-count" style="color: var(--text); font-weight: 600;">${getCompletedCount()}</span><span>/${lessons.length}</span></span>
        </div>
      </div>
    `
    app.appendChild(nav)

    // Main content
    const main = document.createElement('main')
    main.id = 'main-content'
    main.className = 'relative z-10 flex-1 flex max-w-7xl mx-auto w-full p-6 gap-0 min-h-0 overflow-hidden'
    main.innerHTML = `
      <div id="theory-wrap" class="relative flex items-stretch transition-all duration-300 ease-in-out" style="width: 45%; min-width: 280px;">
        <section id="theory-panel" class="flex-1 min-w-0 overflow-y-auto rounded-xl p-6" style="background: var(--surface); border: 1px solid var(--border);"></section>
        <button id="theory-toggle" class="absolute -right-3 top-6 z-20 w-6 h-10 flex items-center justify-center rounded-r-lg cursor-pointer" style="background: var(--surface); border: 1px solid var(--border); border-left: none;">
          <span id="theory-chevron" class="text-xs select-none" style="color: var(--text-dim);">◀</span>
        </button>
      </div>
      <div class="shrink-0" style="width: 24px;"></div>
      <div class="w-px shrink-0" style="background: linear-gradient(to bottom, transparent, var(--border), transparent);"></div>
      <div class="shrink-0" style="width: 24px;"></div>
      <section id="code-panel" class="flex-1 min-w-0 relative rounded-xl p-6 overflow-hidden" style="background: var(--surface); border: 1px solid var(--border);"></section>
    `
    app.appendChild(main)

    // Lesson selector
    const selector = document.createElement('div')
    selector.id = 'lesson-selector'
    selector.className = 'relative z-10 shrink-0 border-t transition-all duration-300'
    selector.style.cssText = `background: color-mix(in srgb, var(--bg) 80%, transparent); border-color: var(--border);`
    selector.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto">
        ${moduleLessons.map((l, i) => `
          <button class="lesson-dot px-3 py-1.5 text-xs font-mono rounded-lg border cursor-pointer whitespace-nowrap"
            data-index="${i}"
            style="${i === state.lessonIndex
              ? 'background: color-mix(in srgb, var(--accent) 20%, transparent); border-color: color-mix(in srgb, var(--accent) 50%, transparent); color: var(--accent);'
              : 'background: transparent; border-color: var(--border); color: var(--text-dim);'}">
            ${i + 1}. ${l.title.split(' ').slice(0, 3).join(' ')}${l.title.split(' ').length > 3 ? '…' : ''}
          </button>
        `).join('')}
      </div>
    `
    app.appendChild(selector)

    // ─── Event handlers ───

    // Home btn
    document.querySelector('#home-btn')?.addEventListener('click', () => {
      state = { view: 'home', module: null, lessonIndex: 0 }
      render()
    })

    // Theme
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        applyTheme(btn.dataset.theme)
        currentTheme = btn.dataset.theme
        document.querySelectorAll('.theme-btn').forEach(b => {
          b.style.cssText = `color: var(--text-dim); background: transparent;`
        })
        btn.style.cssText = `color: var(--accent); background: var(--accent-glow);`
      })
    })

    // Audio
    document.querySelector('#audio-toggle')?.addEventListener('click', () => {
      toggleAudio()
      document.querySelector('#audio-toggle').textContent = isAudioEnabled() ? '🔊' : '🔇'
    })

    // Focus
    document.querySelector('#focus-toggle')?.addEventListener('click', () => {
      focusMode = !focusMode
      document.getElementById('focus-overlay').classList.toggle('hidden', !focusMode)
      document.getElementById('main-nav').classList.toggle('opacity-0', focusMode)
      document.getElementById('main-nav').classList.toggle('pointer-events-none', focusMode)
      document.getElementById('lesson-selector').classList.toggle('opacity-0', focusMode)
      document.getElementById('lesson-selector').classList.toggle('pointer-events-none', focusMode)
      document.getElementById('main-content').classList.toggle('opacity-0', focusMode)
      document.getElementById('main-content').classList.toggle('pointer-events-none', focusMode)
      document.getElementById('particles').style.display = focusMode ? 'none' : ''

      if (focusMode) {
        const focusArea = document.getElementById('focus-typing-area')
        focusArea.innerHTML = ''
        if (focusTypistRef) focusArea.appendChild(focusTypistRef)
      }
    })

    document.querySelector('#focus-exit')?.addEventListener('click', () => {
      focusMode = false
      document.getElementById('focus-overlay').classList.add('hidden')
      document.getElementById('main-nav').classList.remove('opacity-0', 'pointer-events-none')
      document.getElementById('lesson-selector').classList.remove('opacity-0', 'pointer-events-none')
      document.getElementById('main-content').classList.remove('opacity-0', 'pointer-events-none')
      document.getElementById('particles').style.display = ''
    })

    // Theory toggle
    let theoryExpanded = true
    document.querySelector('#theory-toggle')?.addEventListener('click', () => {
      theoryExpanded = !theoryExpanded
      const wrap = document.querySelector('#theory-wrap')
      wrap.style.width = theoryExpanded ? '45%' : '0px'
      wrap.style.minWidth = theoryExpanded ? '280px' : '0px'
      document.querySelector('#theory-panel').classList.toggle('opacity-0', !theoryExpanded)
      document.querySelector('#theory-panel').classList.toggle('pointer-events-none', !theoryExpanded)
      document.querySelector('#theory-chevron').textContent = theoryExpanded ? '◀' : '▶'
    })

    // Dot clicks
    document.querySelectorAll('.lesson-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.index)
        if (idx !== state.lessonIndex) showLesson(idx)
      })
    })

    // ─── Lesson system ───
    let focusTypistRef = null

    function showLesson(index) {
      const lesson = moduleLessons[index]
      LessonIntro(lesson, () => renderLesson(index))
    }

    function renderLesson(index) {
      state.lessonIndex = index
      const lesson = moduleLessons[index]

      document.querySelectorAll('.lesson-dot').forEach((dot, i) => {
        dot.style.cssText = i === index
          ? 'background: color-mix(in srgb, var(--accent) 20%, transparent); border-color: color-mix(in srgb, var(--accent) 50%, transparent); color: var(--accent);'
          : 'background: transparent; border-color: var(--border); color: var(--text-dim);'
      })

      const badge = document.querySelector('#module-badge')
      // Update module badge via nav title (already shows module name)

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
          const difficulty = lesson.difficulty || 'easy'
          const streak = updateStreak()
          const xpResult = addXP(difficulty, focusMode ? 25 : 0)
          const progressCount = getCompletedCount()
          const moduleComplete = moduleLessons.every(l => loadProgress()[l.id]?.completed)

          markLessonComplete(lesson.id, {
            wpm: engine.wpm, accuracy: engine.accuracy, time: engine.elapsed,
            errors: engine.errors, difficulty,
          })

          const repQuality = engine.accuracy >= 95 ? 5 : engine.accuracy >= 80 ? 4 : engine.accuracy >= 60 ? 3 : 2
          recordReview(lesson.id, repQuality)

          const newAch = checkAchievements({
            lessonsCompleted: progressCount + 1, accuracy: engine.accuracy,
            wpm: engine.wpm, difficulty, streak: streak.count,
            level: xpResult.level, moduleComplete, focusMode,
          })
          newAch.forEach(id => showAchievementToast(id))

          if (xpResult.leveledUp) {
            setTimeout(() => showLevelUpToast(xpResult.level), 1500)
          }

          document.querySelector('#progress-count').textContent = `${getCompletedCount()}`
        },
        onProgress(engine) {
          if (focusMode) {
            document.querySelector('#focus-wpm').textContent = engine.wpm
            document.querySelector('#focus-accuracy').textContent = engine.accuracy
            document.querySelector('#focus-progress').textContent = `${engine.currentIndex}/${engine.chars.length}`
          }
        }
      })

      focusTypistRef = typist
      if (focusMode) {
        document.querySelector('#focus-typing-area').innerHTML = ''
        document.querySelector('#focus-typing-area').appendChild(typist)
      } else {
        codePanel.appendChild(typist)
      }

      typist.addEventListener('next-lesson', () => goNext())
    }

    function goNext() {
      const next = getNextLesson(moduleLessons[state.lessonIndex].id)
      if (next) {
        const nextIdx = moduleLessons.indexOf(next)
        showLesson(nextIdx)
      }
    }

    function showAchievementToast(achId) {
      const ach = ACHIEVEMENTS.find(a => a.id === achId)
      if (!ach) return
      const c = document.querySelector('#ach-toast')
      const t = document.createElement('div')
      t.className = 'slide-in px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 text-sm pointer-events-auto'
      t.style.cssText = `background: var(--surface); border-color: var(--accent); max-width: 320px;`
      t.innerHTML = `<span class="text-2xl">${ach.icon}</span><div><div class="font-semibold" style="color: var(--accent);">¡Logro!</div><div style="color: var(--text-dim);">${ach.title}</div></div>`
      c.appendChild(t)
      setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300) }, 4000)
    }

    function showLevelUpToast(level) {
      const c = document.querySelector('#ach-toast')
      const t = document.createElement('div')
      t.className = 'slide-in px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 text-sm pointer-events-auto'
      t.style.cssText = `background: var(--surface); border-color: var(--success); max-width: 320px;`
      t.innerHTML = `<span class="text-2xl">⬆️</span><div><div class="font-semibold" style="color: var(--success);">¡Nivel ${level}!</div><div style="color: var(--text-dim);">Sigue así 🔥</div></div>`
      c.appendChild(t)
      setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300) }, 4000)
    }

    // Start first lesson
    showLesson(0)
  }

  // Start
  render()
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
