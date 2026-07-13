let audioContext = null
let muted = false
let bgmIntervalId = null
let bgmStep = 0

const BGM_NOTES = [220, 277, 330, 277]

function ensureContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioContext.state === 'suspended') audioContext.resume()
  return audioContext
}

export function initAudio() {
  ensureContext()
}

export function setMuted(value) {
  muted = value
}

export function isMuted() {
  return muted
}

function playTone({ frequency, duration, type = 'square', volume = 0.15, startDelay = 0 }) {
  if (muted) return

  const ctx = ensureContext()
  const startTime = ctx.currentTime + startDelay

  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.value = frequency
  gain.gain.value = volume

  oscillator.connect(gain)
  gain.connect(ctx.destination)

  oscillator.start(startTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)
  oscillator.stop(startTime + duration)
}

export function playFireSound() {
  playTone({ frequency: 880, duration: 0.08, type: 'square' })
}

export function playPopSound(stage) {
  playTone({ frequency: 440 + stage * 220, duration: 0.12, type: 'triangle' })
}

export function playItemSound() {
  playTone({ frequency: 660, duration: 0.15, type: 'sine' })
}

export function playGameOverSound() {
  playTone({ frequency: 220, duration: 0.6, type: 'sawtooth' })
}

export function playClearSound() {
  playTone({ frequency: 660, duration: 0.35, type: 'sine' })
  playTone({ frequency: 880, duration: 0.35, type: 'sine', startDelay: 0.15 })
}

export function startBgm() {
  if (bgmIntervalId !== null) return

  bgmStep = 0
  bgmIntervalId = setInterval(() => {
    playTone({
      frequency: BGM_NOTES[bgmStep % BGM_NOTES.length],
      duration: 0.4,
      type: 'sine',
      volume: 0.05,
    })
    bgmStep += 1
  }, 500)
}

export function stopBgm() {
  if (bgmIntervalId === null) return
  clearInterval(bgmIntervalId)
  bgmIntervalId = null
}
