import {
  GAME_WIDTH,
  GROUND_Y,
  GRAVITY,
  BALLOON_RADII,
  BALLOON_SPLIT_VY,
  BALLOON_SPLIT_VX,
} from '../constants'

const BALLOON_COLOR_PALETTE = ['#ef4444', '#3b82f6', '#a855f7', '#f97316', '#ec4899', '#14b8a6']

function pickRandomBalloonColor() {
  return BALLOON_COLOR_PALETTE[Math.floor(Math.random() * BALLOON_COLOR_PALETTE.length)]
}

export function createBalloon({ x, y, vx, vy, stage, color }) {
  return { x, y, vx, vy, stage, color: color ?? pickRandomBalloonColor() }
}

export function updateBalloons(balloons, dt) {
  for (const balloon of balloons) {
    const radius = BALLOON_RADII[balloon.stage]

    balloon.vy += GRAVITY * dt
    balloon.x += balloon.vx * dt
    balloon.y += balloon.vy * dt

    if (balloon.y + radius >= GROUND_Y) {
      balloon.y = GROUND_Y - radius
      balloon.vy = -Math.abs(balloon.vy)
    } else if (balloon.y - radius <= 0) {
      balloon.y = radius
      balloon.vy = Math.abs(balloon.vy)
    }

    if (balloon.x - radius <= 0) {
      balloon.x = radius
      balloon.vx = Math.abs(balloon.vx)
    } else if (balloon.x + radius >= GAME_WIDTH) {
      balloon.x = GAME_WIDTH - radius
      balloon.vx = -Math.abs(balloon.vx)
    }
  }
}

export function splitBalloon(balloon) {
  if (balloon.stage >= BALLOON_RADII.length - 1) return []

  const nextStage = balloon.stage + 1
  return [
    createBalloon({
      x: balloon.x,
      y: balloon.y,
      vx: -BALLOON_SPLIT_VX,
      vy: BALLOON_SPLIT_VY,
      stage: nextStage,
      color: balloon.color,
    }),
    createBalloon({
      x: balloon.x,
      y: balloon.y,
      vx: BALLOON_SPLIT_VX,
      vy: BALLOON_SPLIT_VY,
      stage: nextStage,
      color: balloon.color,
    }),
  ]
}

export function renderBalloons(ctx, balloons) {
  for (const balloon of balloons) {
    const radius = BALLOON_RADII[balloon.stage]

    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)'
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 3
    ctx.shadowOffsetY = 5
    ctx.fillStyle = balloon.color
    ctx.beginPath()
    ctx.arc(balloon.x, balloon.y, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    const gloss = ctx.createRadialGradient(
      balloon.x - radius * 0.35,
      balloon.y - radius * 0.35,
      radius * 0.05,
      balloon.x - radius * 0.1,
      balloon.y - radius * 0.1,
      radius * 0.9,
    )
    gloss.addColorStop(0, 'rgba(255, 255, 255, 0.55)')
    gloss.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = gloss
    ctx.beginPath()
    ctx.arc(balloon.x, balloon.y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}
