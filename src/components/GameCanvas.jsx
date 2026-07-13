import { useEffect, useRef } from 'react'
import { GAME_WIDTH, GAME_HEIGHT } from '../game/constants'
import { attachInput, detachInput } from '../game/input'
import { createGameLoop } from '../game/loop'
import { createPlayer, updatePlayer, renderPlayer } from '../game/entities/player'
import { createHarpoonSystem, updateHarpoons, renderHarpoons } from '../game/entities/harpoon'

function GameCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const player = createPlayer()
    const harpoonSystem = createHarpoonSystem()

    function update(dt) {
      updatePlayer(player, dt)
      updateHarpoons(harpoonSystem, player, dt)
    }

    function render() {
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
      ctx.fillStyle = '#111'
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
      renderHarpoons(ctx, harpoonSystem)
      renderPlayer(ctx, player)
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
