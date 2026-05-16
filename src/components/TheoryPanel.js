import { renderMarkdown } from '../lib/markdown.js'

export function TheoryPanel(lesson) {
  const container = document.createElement('div')
  container.className = 'slide-in h-full flex flex-col'

  container.innerHTML = `
    <div class="flex items-center gap-2 mb-4">
      <span class="text-xs font-mono text-[#6c63ff] bg-[#6c63ff]/10 px-2.5 py-1 rounded-full border border-[#6c63ff]/20">
        ${lesson.module}
      </span>
      <span class="text-xs font-mono text-[#7c7c8a]">Lección ${lesson.id.split('-')[0]}</span>
    </div>

    <h1 class="text-2xl font-bold text-white mb-6 tracking-tight">
      ${lesson.title}
    </h1>

    <div class="flex-1 overflow-y-auto pr-2 space-y-1 theory-content">
      ${renderMarkdown(lesson.theory)}
    </div>

    <div class="mt-4 pt-4 border-t border-[#2a2a3e]">
      <button id="hint-btn" class="text-sm text-[#7c7c8a] hover:text-[#6c63ff] transition-colors cursor-pointer flex items-center gap-1.5">
        <span>💡</span> ¿Necesitas ayuda?
      </button>
      <div id="hint-box" class="hidden mt-2 p-3 bg-[#6c63ff]/5 border border-[#6c63ff]/20 rounded-lg text-sm text-[#c8c8d4]">
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
    }
  }, 0)

  return container
}
