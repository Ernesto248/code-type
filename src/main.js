import './style.css'
import { initTheme } from './themes.js'
import { App } from './components/App.js'

// Apply saved theme before rendering anything to avoid flash
initTheme()

App()
