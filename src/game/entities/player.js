import {
  GAME_WIDTH,
  GROUND_Y,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
  PLAYER_LIVES_INITIAL,
  PLAYER_INVULNERABLE_TIME,
} from '../constants'
import { isPressed } from '../input'

export function createPlayer() {
  return {
    x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: GROUND_Y - PLAYER_HEIGHT,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    lives: PLAYER_LIVES_INITIAL,
    invulnerableRemaining: 0,
  }
}

export function updatePlayer(player, dt) {
  if (player.invulnerableRemaining > 0) player.invulnerableRemaining -= dt

  if (isPressed('left')) player.x -= PLAYER_SPEED * dt
  if (isPressed('right')) player.x += PLAYER_SPEED * dt

  player.x = Math.max(0, Math.min(GAME_WIDTH - player.width, player.x))
}

export function damagePlayer(player) {
  if (player.invulnerableRemaining > 0) return

  player.lives -= 1
  player.invulnerableRemaining = PLAYER_INVULNERABLE_TIME
}

export function renderPlayer(ctx, player) {
  const { x, y, width, height } = player
  const centerX = x + width / 2

  ctx.globalAlpha = player.invulnerableRemaining > 0 ? 0.5 : 1

  const headRadius = width * 0.28
  const headCenterY = y + headRadius

  const legHeight = height * 0.22
  const torsoTop = y + headRadius * 2
  const torsoBottom = y + height - legHeight
  const torsoWidth = width * 0.6
  const torsoX = centerX - torsoWidth / 2

  const armY = torsoTop + (torsoBottom - torsoTop) * 0.2
  const armLength = width * 0.4

  const legWidth = torsoWidth * 0.4

  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 4
  ctx.lineCap = 'round'

  // arms
  ctx.beginPath()
  ctx.moveTo(torsoX, armY)
  ctx.lineTo(torsoX - armLength, armY + armLength * 0.4)
  ctx.moveTo(torsoX + torsoWidth, armY)
  ctx.lineTo(torsoX + torsoWidth + armLength, armY + armLength * 0.4)
  ctx.stroke()

  // legs
  ctx.beginPath()
  ctx.moveTo(torsoX + legWidth * 0.5, torsoBottom)
  ctx.lineTo(torsoX + legWidth * 0.5, y + height)
  ctx.moveTo(torsoX + torsoWidth - legWidth * 0.5, torsoBottom)
  ctx.lineTo(torsoX + torsoWidth - legWidth * 0.5, y + height)
  ctx.stroke()

  // torso
  ctx.fillStyle = '#38bdf8'
  ctx.fillRect(torsoX, torsoTop, torsoWidth, torsoBottom - torsoTop)

  // head
  ctx.fillStyle = '#fde68a'
  ctx.beginPath()
  ctx.arc(centerX, headCenterY, headRadius, 0, Math.PI * 2)
  ctx.fill()

  ctx.globalAlpha = 1
}
