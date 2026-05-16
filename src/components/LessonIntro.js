/**
 * LessonIntro — full-screen modal shown before each lesson.
 * Displays the lesson title, module, a description of what you'll learn,
 * and a "Comenzar" button.
 */

import { renderMarkdown } from '../lib/markdown.js'

export function LessonIntro(lesson, onStart) {
  const overlay = document.createElement('div')
  overlay.className = 'fixed inset-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-sm flex items-center justify-center slide-in'

  overlay.innerHTML = `
    <div class="max-w-lg w-full mx-4 bg-[#14141f] border border-[#2a2a3e] rounded-2xl p-8 text-center complete-glow">
      <!-- Module badge -->
      <div class="mb-4">
        <span class="text-xs font-mono text-[#6c63ff] bg-[#6c63ff]/10 px-3 py-1.5 rounded-full border border-[#6c63ff]/20">
          ${lesson.module}
        </span>
      </div>

      <!-- Level number -->
      <div class="text-5xl mb-4">⌨️</div>
      <h2 class="text-2xl font-bold text-white mb-2">Nivel ${lesson.id.split('-')[0]}</h2>
      <h3 class="text-lg text-[#c8c8d4] mb-6">${lesson.title}</h3>

      <!-- Divider -->
      <div class="h-px bg-gradient-to-r from-transparent via-[#2a2a3e] to-transparent mb-6"></div>

      <!-- What you'll learn -->
      <div class="text-left bg-[#0a0a0f] border border-[#2a2a3e] rounded-xl p-5 mb-6">
        <div class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <span>🎯</span> En esta lección:
        </div>
        <div class="text-sm text-[#c8c8d4] leading-relaxed">
          ${renderMarkdown(lesson.intro || 'Practicarás conceptos de ' + lesson.module)}
        </div>
      </div>

      <!-- Tip -->
      <div class="text-sm text-[#7c7c8a] mb-6">
        💡 Tip: No compitas con la velocidad, compite con la precisión. La velocidad llega sola.
      </div>

      <!-- Start button -->
      <button id="intro-start-btn" class="w-full px-6 py-3 bg-[#6c63ff] hover:bg-[#5a52e0] text-white rounded-xl font-semibold text-base transition-all cursor-pointer active:scale-[0.98]">
        Comenzar lección →
      </button>
    </div>
  `

  document.body.appendChild(overlay)

  const startBtn = overlay.querySelector('#intro-start-btn')
  startBtn.addEventListener('click', () => {
    overlay.classList.add('opacity-0')
    overlay.style.transition = 'opacity 0.2s ease'
    setTimeout(() => {
      overlay.remove()
      if (onStart) onStart()
    }, 200)
  })

  return overlay
}
