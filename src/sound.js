/**
 * Sound effects using Web Audio API.
 * No external files needed — generates tones programmatically.
 */

let audioCtx = null

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

function playTone(freq, duration, type = 'sine', volume = 0.08) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)

    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch { /* audio not available */ }
}

/**
 * Play a keypress sound (soft click)
 * Different pitch depending on accuracy
 */
export function playKeypress(correct = true) {
  if (correct) {
    playTone(880, 0.04, 'sine', 0.04)
    playTone(1100, 0.03, 'sine', 0.02)
  } else {
    playTone(220, 0.12, 'square', 0.04)
    playTone(180, 0.08, 'sawtooth', 0.02)
  }
}

/**
 * Play completion fanfare
 */
export function playComplete() {
  const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, 'sine', 0.06), i * 120)
  })
  // Bass note
  setTimeout(() => playTone(262, 0.5, 'triangle', 0.04), 0)
}

/**
 * Play a soft backspace sound
 */
export function playBackspace() {
  playTone(300, 0.03, 'sine', 0.03)
}

/**
 * Toggle audio on/off
 */
let audioEnabled = true

export function isAudioEnabled() {
  return audioEnabled
}

export function toggleAudio() {
  audioEnabled = !audioEnabled
  return audioEnabled
}

export function setAudioEnabled(enabled) {
  audioEnabled = enabled
}
