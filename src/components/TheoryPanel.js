import { renderMarkdown } from '../lib/markdown.js'

export function TheoryPanel(lesson) {
  const container = document.createElement('div')
  container.className = 'slide-in h-full flex flex-col'

  container.innerHTML = `
    <div class="flex items-center gap-2 mb-4 shrink-0">
      <span class="text-xs font-mono px-2.5 py-1 rounded-full border" style="color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, transparent); border-color: color-mix(in srgb, var(--accent) 20%, transparent);">
        ${lesson.module}
      </span>
      <span class="text-xs font-mono" style="color: var(--text-dim);">Lección ${lesson.id.split('-')[0]}</span>
    </div>

    <h1 class="text-2xl font-bold mb-6 tracking-tight" style="color: var(--text);">
      ${lesson.title}
    </h1>

    <div class="flex-1 min-h-0 overflow-y-auto pr-1 theory-scroll">
      <div class="space-y-1 theory-content" style="color: var(--text-dim);">
        ${renderMarkdown(lesson.theory)}
      </div>
    </div>

    <div class="mt-4 pt-4 border-t shrink-0" style="border-color: var(--border);">
      <button id="hint-btn" class="text-sm transition-colors cursor-pointer flex items-center gap-1.5" style="color: var(--text-dim);">
        <span>💡</span> ¿Necesitas ayuda?
      </button>
      <div id="hint-box" class="hidden mt-2 p-3 rounded-lg text-sm" style="background: color-mix(in srgb, var(--accent) 5%, transparent); border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent); color: var(--text-dim);">
        ${lesson.hint}
      </div>
    </div>
  `

  // Hint toggle
  setTimeout(() => {
    const hintBtn = container.querySelector('#hint-btn')
    const hintBox = container.querySelector('#hint-box')
    if (hintBtn && hintBox) {
      hintBtn.addEventListener('click', () => {
        hintBox.classList.toggle('hidden')
        hintBox.classList.add('slide-in')
      })
      hintBtn.addEventListener('mouseenter', () => {
        hintBtn.style.color = 'var(--accent)'
      })
      hintBtn.addEventListener('mouseleave', () => {
        hintBtn.style.color = 'var(--text-dim)'
      })
    }
  }, 0)

  return container
}
