export function createGameLoop({ update, render }) {
  let rafId = null
  let lastTimestamp = null

  function tick(timestamp) {
    if (lastTimestamp === null) lastTimestamp = timestamp
    const dt = (timestamp - lastTimestamp) / 1000
    lastTimestamp = timestamp

    update(dt)
    render()

    rafId = requestAnimationFrame(tick)
  }

  function start() {
    if (rafId !== null) return
    lastTimestamp = null
    rafId = requestAnimationFrame(tick)
  }

  function stop() {
    if (rafId === null) return
    cancelAnimationFrame(rafId)
    rafId = null
  }

  return { start, stop }
}
