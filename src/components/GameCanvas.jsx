import { useEffect, useRef, useState } from 'react'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  ITEM_DROP_CHANCE,
  SCORE_PER_HIT,
  CLEAR_COUNTDOWN_DURATION,
} from '../game/constants'
import { attachInput, detachInput, isPressed } from '../game/input'
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
import { getStage } from '../game/stages'
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
  const advanceStageRef = useRef(() => {})
  const [status, setStatus] = useState('playing')

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const player = createPlayer()
    const harpoonSystem = createHarpoonSystem()
    let stageIndex = 0
    let stage = null
    let obstacles = []
    let balloons = []
    let items = []
    let score = 0
    let gameOver = false
    let cleared = false
    let remainingTime = 0
    let clearCountdown = 0
    let paused = false
    let wasPausePressed = false

    function loadStage(index) {
      stageIndex = index
      stage = getStage(index)
      obstacles = stage.obstacles.map(createObstacle)
      balloons = stage.balloons.map(createBalloon)
      items = []
      remainingTime = stage.timeLimit
      cleared = false
    }

    function advanceStage() {
      loadStage(stageIndex + 1)
      setStatus('playing')
    }
    advanceStageRef.current = advanceStage

    loadStage(0)

    function update(dt) {
      const pausePressed = isPressed('pause')
      const pausePressedThisFrame = pausePressed && !wasPausePressed
      wasPausePressed = pausePressed
      if (pausePressedThisFrame && !gameOver && !cleared) paused = !paused

      if (paused || gameOver) return

      if (cleared) {
        clearCountdown -= dt
        if (clearCountdown <= 0) advanceStage()
        return
      }

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
        balloons.push(createBalloon(stage.timePenaltyBalloon))
        remainingTime = stage.timeLimit
      }

      if (balloons.length === 0 && !cleared) {
        cleared = true
        clearCountdown = CLEAR_COUNTDOWN_DURATION
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
      ctx.fillText(stage.name, 12, 24)
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

        if (cleared) {
          ctx.fillText(
            `Next stage in ${Math.ceil(clearCountdown)}...`,
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2 + 64,
          )
        }

        ctx.textAlign = 'left'
      }

      if (paused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

        ctx.font = 'bold 32px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#fff'
        ctx.fillText('PAUSED', GAME_WIDTH / 2, GAME_HEIGHT / 2)
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
          {status === 'cleared' && (
            <button
              type="button"
              onClick={() => advanceStageRef.current()}
              style={{ marginRight: 8 }}
            >
              다음 스테이지
            </button>
          )}
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
