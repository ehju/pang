const KEY_MAP = {
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  Space: 'fire',
  Enter: 'pause',
}

const state = {
  left: false,
  right: false,
  fire: false,
  pause: false,
}

function handleKeyDown(event) {
  const action = KEY_MAP[event.code]
  if (action) state[action] = true
}

function handleKeyUp(event) {
  const action = KEY_MAP[event.code]
  if (action) state[action] = false
}

export function attachInput() {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
}

export function detachInput() {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  state.left = false
  state.right = false
  state.fire = false
  state.pause = false
}

export function isPressed(action) {
  return Boolean(state[action])
}
