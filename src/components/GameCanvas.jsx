import { useEffect, useRef } from 'react'
import { GAME_WIDTH, GAME_HEIGHT } from '../game/constants'
import { attachInput, detachInput, isPressed } from '../game/input'
import { createGameLoop } from '../game/loop'

const DEBUG_BOX_SIZE = 32
const DEBUG_BOX_SPEED = 200 // px per second

function GameCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const debugBox = {
      x: GAME_WIDTH / 2 - DEBUG_BOX_SIZE / 2,
      y: GAME_HEIGHT / 2 - DEBUG_BOX_SIZE / 2,
    }

    function update(dt) {
      if (isPressed('left')) debugBox.x -= DEBUG_BOX_SPEED * dt
      if (isPressed('right')) debugBox.x += DEBUG_BOX_SPEED * dt

      debugBox.x = Math.max(0, Math.min(GAME_WIDTH - DEBUG_BOX_SIZE, debugBox.x))
    }

    function render() {
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
      ctx.fillStyle = '#111'
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
      ctx.fillStyle = '#4ade80'
      ctx.fillRect(debugBox.x, debugBox.y, DEBUG_BOX_SIZE, DEBUG_BOX_SIZE)
    }

    attachInput()
    const loop = createGameLoop({ update, render })
    loop.start()

    return () => {
      loop.stop()
      detachInput()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      style={{ display: 'block', margin: '0 auto', border: '1px solid #333' }}
    />
  )
}

export default GameCanvas
