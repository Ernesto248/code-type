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
      '--bg': '#0d0d0d',
      '--surface': '#111111',
      '--surface-2': '#1a1a1a',
      '--border': '#1f3a1f',
      '--text': '#33ff33',
      '--text-dim': '#1a7a1a',
      '--accent': '#00ff41',
      '--accent-glow': '#00ff4115',
      '--success': '#00ff41',
      '--error': '#ff3333',
      '--caret-color': '#33ff33',
      '--pending-char': '#1a3a1a',
    },
  },

  'jetbrains': {
    name: 'JetBrains IDE',
    icon: '🧊',
    font: "'JetBrains Mono', 'Fira Code', monospace",
    props: {
      '--bg': '#1e1e2e',
      '--surface': '#252536',
      '--surface-2': '#313244',
      '--border': '#45475a',
      '--text': '#cdd6f4',
      '--text-dim': '#6c7086',
      '--accent': '#89b4fa',
      '--accent-glow': '#89b4fa25',
      '--success': '#a6e3a1',
      '--error': '#f38ba8',
      '--caret-color': '#f5c2e7',
      '--pending-char': '#585b70',
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

  // Apply each CSS variable
  Object.entries(theme.props).forEach(([key, val]) => {
    root.style.setProperty(key, val)
  })

  // Apply font
  root.style.setProperty('--font-mono', theme.font)

  // Add theme class for special CSS
  root.className = '' // reset
  root.classList.add(`theme-${id}`)

  saveTheme(id)
}

/**
 * Initialize theme on load
 */
export function initTheme() {
  applyTheme(getSavedTheme())
}
