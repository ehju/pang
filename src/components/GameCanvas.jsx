import { useEffect, useRef } from 'react'
import { GAME_WIDTH, GAME_HEIGHT } from '../game/constants'
import { attachInput, detachInput } from '../game/input'
import { createGameLoop } from '../game/loop'
import { createPlayer, updatePlayer, renderPlayer, damagePlayer } from '../game/entities/player'
import { createHarpoonSystem, updateHarpoons, renderHarpoons } from '../game/entities/harpoon'
import { createBalloon, updateBalloons, splitBalloon, renderBalloons } from '../game/entities/balloon'
import { harpoonHitsBalloon, playerHitsBalloon } from '../game/systems/collision'

// TODO(Phase 5): 실제 스테이지 데이터에서 풍선을 스폰하도록 교체
function createInitialBalloons() {
  return [
    createBalloon({ x: GAME_WIDTH / 2, y: 100, vx: 80, vy: 0, stage: 0 }),
  ]
}

function GameCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const player = createPlayer()
    const harpoonSystem = createHarpoonSystem()
    let balloons = createInitialBalloons()
    let gameOver = false

    function update(dt) {
      if (gameOver) return

      updatePlayer(player, dt)
      updateHarpoons(harpoonSystem, player, dt)
      updateBalloons(balloons, dt)

      const survivingBalloons = []
      for (const balloon of balloons) {
        const hitIndex = harpoonSystem.harpoons.findIndex((harpoon) =>
          harpoonHitsBalloon(harpoon, balloon),
        )

        if (hitIndex === -1) {
          survivingBalloons.push(balloon)
          continue
        }

        harpoonSystem.harpoons.splice(hitIndex, 1)
        survivingBalloons.push(...splitBalloon(balloon))
      }
      balloons = survivingBalloons

      if (balloons.some((balloon) => playerHitsBalloon(player, balloon))) {
        damagePlayer(player)
      }

      if (player.lives <= 0) gameOver = true
    }

    function render() {
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
      ctx.fillStyle = '#111'
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
      renderBalloons(ctx, balloons)
      renderHarpoons(ctx, harpoonSystem)
      renderPlayer(ctx, player)

      ctx.fillStyle = '#fff'
      ctx.font = '16px sans-serif'
      ctx.fillText(`Lives: ${player.lives}`, 12, 24)

      if (gameOver) {
        ctx.fillStyle = '#f87171'
        ctx.font = 'bold 32px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2)
        ctx.textAlign = 'left'
      }
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
