import { useEffect, useRef } from 'react'
import { GAME_WIDTH, GAME_HEIGHT } from '../game/constants'
import { attachInput, detachInput } from '../game/input'
import { createGameLoop } from '../game/loop'
import { createPlayer, updatePlayer, renderPlayer, damagePlayer } from '../game/entities/player'
import { createHarpoonSystem, updateHarpoons, renderHarpoons } from '../game/entities/harpoon'
import { createBalloon, updateBalloons, splitBalloon, renderBalloons } from '../game/entities/balloon'
import { createObstacle, renderObstacle } from '../game/entities/obstacle'
import {
  harpoonHitsBalloon,
  playerHitsBalloon,
  resolveBalloonObstacleCollision,
} from '../game/systems/collision'
import { MISSION_1 } from '../game/stages/mission1'

function GameCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const player = createPlayer()
    const harpoonSystem = createHarpoonSystem()
    const obstacles = MISSION_1.obstacles.map(createObstacle)
    let balloons = MISSION_1.balloons.map(createBalloon)
    let gameOver = false
    let cleared = false
    let remainingTime = MISSION_1.timeLimit

    function update(dt) {
      if (gameOver || cleared) return

      updatePlayer(player, dt)
      updateHarpoons(harpoonSystem, player, obstacles, dt)
      updateBalloons(balloons, dt)

      for (const balloon of balloons) {
        for (const obstacle of obstacles) {
          resolveBalloonObstacleCollision(balloon, obstacle)
        }
      }

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

      remainingTime -= dt
      if (remainingTime <= 0) {
        balloons.push(createBalloon(MISSION_1.timePenaltyBalloon))
        remainingTime = MISSION_1.timeLimit
      }

      if (balloons.length === 0) cleared = true
    }

    function render() {
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
      ctx.fillStyle = '#111'
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
      obstacles.forEach((obstacle) => renderObstacle(ctx, obstacle))
      renderBalloons(ctx, balloons)
      renderHarpoons(ctx, harpoonSystem)
      renderPlayer(ctx, player)

      ctx.fillStyle = '#fff'
      ctx.font = '16px sans-serif'
      ctx.fillText(`Lives: ${player.lives}`, 12, 24)
      ctx.fillText(`Time: ${Math.ceil(remainingTime)}s`, 12, 46)

      if (gameOver) {
        ctx.fillStyle = '#f87171'
        ctx.font = 'bold 32px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2)
        ctx.textAlign = 'left'
      } else if (cleared) {
        ctx.fillStyle = '#4ade80'
        ctx.font = 'bold 32px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('STAGE CLEAR', GAME_WIDTH / 2, GAME_HEIGHT / 2)
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
