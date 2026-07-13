import { useEffect, useRef, useState } from 'react'
import { GAME_WIDTH, GAME_HEIGHT, ITEM_DROP_CHANCE, SCORE_PER_HIT } from '../game/constants'
import { attachInput, detachInput } from '../game/input'
import { createGameLoop } from '../game/loop'
import { createPlayer, updatePlayer, renderPlayer, damagePlayer } from '../game/entities/player'
import {
  createHarpoonSystem,
  updateHarpoons,
  renderHarpoons,
  applyRapidFire,
} from '../game/entities/harpoon'
import { createBalloon, updateBalloons, splitBalloon, renderBalloons } from '../game/entities/balloon'
import { createObstacle, renderObstacle } from '../game/entities/obstacle'
import { createItem, updateItems, renderItems, pickRandomItemType } from '../game/entities/item'
import {
  harpoonHitsBalloon,
  playerHitsBalloon,
  playerHitsItem,
  resolveBalloonObstacleCollision,
} from '../game/systems/collision'
import { MISSION_1 } from '../game/stages/mission1'
import {
  playPopSound,
  playItemSound,
  playGameOverSound,
  playClearSound,
  startBgm,
  stopBgm,
} from '../game/audio'

function GameCanvas({ onRestart, onExit }) {
  const canvasRef = useRef(null)
  const [status, setStatus] = useState('playing')

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const player = createPlayer()
    const harpoonSystem = createHarpoonSystem()
    const obstacles = MISSION_1.obstacles.map(createObstacle)
    let balloons = MISSION_1.balloons.map(createBalloon)
    let items = []
    let score = 0
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
        score += SCORE_PER_HIT[balloon.stage]
        playPopSound(balloon.stage)

        if (Math.random() < ITEM_DROP_CHANCE) {
          items.push(createItem({ x: balloon.x, y: balloon.y, type: pickRandomItemType() }))
        }
      }
      balloons = survivingBalloons

      items = updateItems(items, dt)

      items = items.filter((item) => {
        if (!playerHitsItem(player, item)) return true

        if (item.type === 'extra-life') player.lives += 1
        if (item.type === 'rapid-fire') applyRapidFire(harpoonSystem)
        playItemSound()

        return false
      })

      if (balloons.some((balloon) => playerHitsBalloon(player, balloon))) {
        damagePlayer(player)
      }

      if (player.lives <= 0 && !gameOver) {
        gameOver = true
        playGameOverSound()
        setStatus('gameOver')
      }

      remainingTime -= dt
      if (remainingTime <= 0) {
        balloons.push(createBalloon(MISSION_1.timePenaltyBalloon))
        remainingTime = MISSION_1.timeLimit
      }

      if (balloons.length === 0 && !cleared) {
        cleared = true
        playClearSound()
        setStatus('cleared')
      }
    }

    function render() {
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
      ctx.fillStyle = '#111'
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
      obstacles.forEach((obstacle) => renderObstacle(ctx, obstacle))
      renderBalloons(ctx, balloons)
      renderItems(ctx, items)
      renderHarpoons(ctx, harpoonSystem)
      renderPlayer(ctx, player)

      ctx.fillStyle = '#fff'
      ctx.font = '16px sans-serif'
      ctx.fillText(MISSION_1.name, 12, 24)
      ctx.fillText(`Score: ${score}`, 12, 46)
      ctx.fillText(`Lives: ${player.lives}`, 12, 68)
      ctx.fillText(`Time: ${Math.ceil(remainingTime)}s`, 12, 90)

      if (gameOver || cleared) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

        ctx.font = 'bold 32px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = gameOver ? '#f87171' : '#4ade80'
        ctx.fillText(gameOver ? 'GAME OVER' : 'STAGE CLEAR', GAME_WIDTH / 2, GAME_HEIGHT / 2)

        ctx.font = '20px sans-serif'
        ctx.fillStyle = '#fff'
        ctx.fillText(`Score: ${score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 36)
        ctx.textAlign = 'left'
      }
    }

    startBgm()
    attachInput()
    const loop = createGameLoop({ update, render })
    loop.start()

    return () => {
      loop.stop()
      detachInput()
      stopBgm()
    }
  }, [])

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        style={{ display: 'block', margin: '0 auto', border: '1px solid #333' }}
      />
      {status !== 'playing' && (
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <button type="button" onClick={onRestart} style={{ marginRight: 8 }}>
            다시하기
          </button>
          <button type="button" onClick={onExit}>
            메인으로
          </button>
        </div>
      )}
    </div>
  )
}

export default GameCanvas
