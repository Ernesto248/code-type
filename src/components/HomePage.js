/**
 * HomePage — Landing page with module/course selection
 */

import { lessons } from '../lessons/index.js'
import { getCompletedCount, loadProgress } from '../stores/progress.js'
import { getStreak, getXP } from '../stores/streak.js'

const MODULE_ICONS = {
  'JS Basics': '🟡',
  'DOM Manipulation': '🟣',
  'Arrays en JavaScript': '🔵',
  'Fetch y APIs': '🟢',
}

const MODULE_DESCS = {
  'JS Basics': 'Variables, condicionales, bucles y funciones. El ABC de JavaScript.',
  'DOM Manipulation': 'Selecciona elementos, modifica el DOM y maneja eventos.',
  'Arrays en JavaScript': 'Transforma datos con map, filter y reduce.',
  'Fetch y APIs': 'Comunícate con servidores usando fetch y async/await.',
}

export function HomePage({ onSelectModule }) {
  const moduleSet = [...new Set(lessons.map(l => l.module))]
  const progress = loadProgress()
  const streak = getStreak()
  const xp = getXP()
  const completed = getCompletedCount()

  const container = document.createElement('div')
  container.className = 'min-h-screen flex flex-col'
  container.style.background = 'var(--bg)'

  container.innerHTML = `
    <!-- Hero -->
    <div class="flex-1 flex flex-col items-center justify-center px-6 py-16">
      <div class="text-center mb-16 slide-in">
        <div class="text-6xl mb-6">⌨️</div>
        <h1 class="text-4xl font-bold mb-3" style="color: var(--text);">
          Code<span style="color: var(--accent);">Type</span>
        </h1>
        <p class="text-lg max-w-md mx-auto" style="color: var(--text-dim);">
          Aprende a programar escribiendo código. Como Monkeytype, pero para desarrolladores.
        </p>
      </div>

      <!-- Stats bar -->
      <div class="flex items-center gap-6 mb-12 text-sm font-mono slide-in" style="animation-delay: 0.1s;">
        <div class="px-4 py-2 rounded-xl" style="background: var(--surface); border: 1px solid var(--border);">
          <span style="color: var(--text-dim);">🔥 Racha</span>
          <span class="ml-1.5 font-bold" style="color: var(--text);">${streak.count} días</span>
        </div>
        <div class="px-4 py-2 rounded-xl" style="background: var(--surface); border: 1px solid var(--border);">
          <span style="color: var(--text-dim);">⬆️ Nivel</span>
          <span class="ml-1.5 font-bold" style="color: var(--accent);">${xp.level}</span>
        </div>
        <div class="px-4 py-2 rounded-xl" style="background: var(--surface); border: 1px solid var(--border);">
          <span style="color: var(--text-dim);">📚 Lecciones</span>
          <span class="ml-1.5 font-bold" style="color: var(--success);">${completed}/${lessons.length}</span>
        </div>
      </div>

      <!-- Module cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full slide-in" style="animation-delay: 0.2s;">
        ${moduleSet.map(mod => {
          const modLessons = lessons.filter(l => l.module === mod)
          const modCompleted = modLessons.filter(l => progress[l.id]?.completed).length
          return `
            <button class="module-card group text-left p-5 rounded-xl transition-all duration-200 cursor-pointer"
              data-module="${mod}"
              style="background: var(--surface); border: 1px solid var(--border);"
              onmouseenter="this.style.borderColor='var(--accent)'"
              onmouseleave="this.style.borderColor='var(--border)'"
            >
              <div class="flex items-start justify-between mb-3">
                <span class="text-3xl">${MODULE_ICONS[mod] || '📦'}</span>
                <span class="text-xs font-mono px-2 py-0.5 rounded-full" style="background: color-mix(in srgb, var(--accent) 10%, transparent); color: var(--accent);">
                  ${modCompleted}/${modLessons.length}
                </span>
              </div>
              <h3 class="font-semibold mb-1" style="color: var(--text);">${mod}</h3>
              <p class="text-sm" style="color: var(--text-dim);">${MODULE_DESCS[mod] || ''}</p>
            </button>
          `
        }).join('')}
      </div>

      <!-- Footer hint -->
      <div class="mt-16 text-xs" style="color: var(--pending-char);">
        Más módulos próximamente 🚧
      </div>
    </div>
  `

  // Module click handlers
  setTimeout(() => {
    container.querySelectorAll('.module-card').forEach(card => {
      card.addEventListener('click', () => {
        const mod = card.dataset.module
        if (onSelectModule) onSelectModule(mod)
      })
    })
  }, 0)

  return container
}
