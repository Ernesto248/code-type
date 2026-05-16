/**
 * Themes for CodeType
 * Each theme defines CSS custom properties applied to :root
 */

export const themes = {
  'codetype-dark': {
    name: 'CodeType Dark',
    icon: '🌙',
    font: "'JetBrains Mono', monospace",
    props: {
      '--bg': '#0a0a0f',
      '--surface': '#14141f',
      '--surface-2': '#1c1c2e',
      '--border': '#2a2a3e',
      '--text': '#e1e1e6',
      '--text-dim': '#7c7c8a',
      '--accent': '#6c63ff',
      '--accent-glow': '#6c63ff40',
      '--success': '#4ade80',
      '--error': '#f87171',
      '--caret-color': '#6c63ff',
      '--pending-char': '#4a4a5e',
    },
  },

  'hacker-terminal': {
    name: 'Hacker Terminal',
    icon: '💻',
    font: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
    props: {
      '--bg': '#0a0a0a',
      '--surface': '#0f0f0f',
      '--surface-2': '#141414',
      '--border': '#1a3a1a',
      '--text': '#33ff33',
      '--text-dim': '#1a7a1a',
      '--accent': '#00ff41',
      '--accent-glow': '#00ff4115',
      '--success': '#33ff33',
      '--error': '#ff3333',
      '--caret-color': '#33ff33',
      '--pending-char': '#142814',
    },
  },

  'jetbrains': {
    name: 'JetBrains IDE',
    icon: '🧊',
    font: "'JetBrains Mono', monospace",
    props: {
      '--bg': '#1e1e1e',
      '--surface': '#252525',
      '--surface-2': '#2d2d2d',
      '--border': '#3c3f41',
      '--text': '#a9b7c6',
      '--text-dim': '#6a7a8a',
      '--accent': '#cc7832',
      '--accent-glow': '#cc783225',
      '--success': '#6a8759',
      '--error': '#e06a6a',
      '--caret-color': '#6897bb',
      '--pending-char': '#5a5a5a',
    },
  },
}

const THEME_KEY = 'codetype_theme'

export function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'codetype-dark'
  } catch {
    return 'codetype-dark'
  }
}

export function saveTheme(id) {
  try {
    localStorage.setItem(THEME_KEY, id)
  } catch { /* noop */ }
}

export function applyTheme(id) {
  const theme = themes[id]
  if (!theme) return

  const root = document.documentElement

  Object.entries(theme.props).forEach(([key, val]) => {
    root.style.setProperty(key, val)
  })

  root.style.setProperty('--font-mono', theme.font)

  root.className = ''
  root.classList.add(`theme-${id}`)

  saveTheme(id)
}

export function initTheme() {
  applyTheme(getSavedTheme())
}
