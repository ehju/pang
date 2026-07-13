import {
  GAME_WIDTH,
  GROUND_Y,
  GRAVITY,
  BALLOON_RADII,
  BALLOON_SPLIT_VY,
  BALLOON_SPLIT_VX,
} from '../constants'

const BALLOON_COLORS = ['#15803d', '#22c55e', '#86efac']

export function createBalloon({ x, y, vx, vy, stage }) {
  return { x, y, vx, vy, stage }
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
    }),
    createBalloon({
      x: balloon.x,
      y: balloon.y,
      vx: BALLOON_SPLIT_VX,
      vy: BALLOON_SPLIT_VY,
      stage: nextStage,
    }),
  ]
}

export function renderBalloons(ctx, balloons) {
  for (const balloon of balloons) {
    const radius = BALLOON_RADII[balloon.stage]
    ctx.fillStyle = BALLOON_COLORS[balloon.stage]
    ctx.beginPath()
    ctx.arc(balloon.x, balloon.y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}
