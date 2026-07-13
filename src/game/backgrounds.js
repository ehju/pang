import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y } from './constants'

const THEMES = ['mountain', 'lake', 'castle', 'sea']

export function pickRandomBackgroundTheme() {
  return THEMES[Math.floor(Math.random() * THEMES.length)]
}

function fillSky(ctx, topColor, bottomColor) {
  const gradient = ctx.createLinearGradient(0, 0, 0, GROUND_Y)
  gradient.addColorStop(0, topColor)
  gradient.addColorStop(1, bottomColor)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, GAME_WIDTH, GROUND_Y)
}

function drawTriangleMountain(ctx, baseX, baseWidth, height, color) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(baseX - baseWidth / 2, GROUND_Y)
  ctx.lineTo(baseX, GROUND_Y - height)
  ctx.lineTo(baseX + baseWidth / 2, GROUND_Y)
  ctx.closePath()
  ctx.fill()
}

function renderMountain(ctx) {
  fillSky(ctx, '#bfe3ff', '#eef8ff')

  ctx.fillStyle = '#fff7cc'
  ctx.beginPath()
  ctx.arc(GAME_WIDTH - 70, 70, 34, 0, Math.PI * 2)
  ctx.fill()

  drawTriangleMountain(ctx, GAME_WIDTH * 0.25, 220, 220, '#94a3b8')
  drawTriangleMountain(ctx, GAME_WIDTH * 0.55, 260, 280, '#64748b')
  drawTriangleMountain(ctx, GAME_WIDTH * 0.85, 200, 190, '#94a3b8')

  ctx.fillStyle = '#86efac'
  ctx.fillRect(0, GROUND_Y - 10, GAME_WIDTH, 10)
}

function renderLake(ctx) {
  fillSky(ctx, '#cdeaff', '#f0fbff')

  ctx.fillStyle = '#4ade80'
  for (const x of [60, 140, GAME_WIDTH - 90]) {
    ctx.beginPath()
    ctx.moveTo(x, GROUND_Y - 150)
    ctx.lineTo(x - 24, GROUND_Y - 40)
    ctx.lineTo(x + 24, GROUND_Y - 40)
    ctx.closePath()
    ctx.fill()
  }

  ctx.fillStyle = '#38bdf8'
  ctx.fillRect(0, GROUND_Y - 40, GAME_WIDTH, 40)

  ctx.strokeStyle = 'rgba(255,255,255,0.5)'
  ctx.lineWidth = 2
  for (let i = 0; i < 4; i++) {
    const y = GROUND_Y - 30 + i * 8
    ctx.beginPath()
    ctx.moveTo(20, y)
    ctx.lineTo(GAME_WIDTH - 20, y)
    ctx.stroke()
  }
}

function renderCastle(ctx) {
  fillSky(ctx, '#7c6a9c', '#f0a6c0')

  ctx.fillStyle = '#4b3b63'
  const towerY = GROUND_Y - 180
  ctx.fillRect(GAME_WIDTH / 2 - 90, towerY, 40, 180)
  ctx.fillRect(GAME_WIDTH / 2 + 50, towerY, 40, 180)
  ctx.fillRect(GAME_WIDTH / 2 - 60, towerY + 30, 120, 150)

  ctx.beginPath()
  ctx.moveTo(GAME_WIDTH / 2 - 90, towerY)
  ctx.lineTo(GAME_WIDTH / 2 - 70, towerY - 26)
  ctx.lineTo(GAME_WIDTH / 2 - 50, towerY)
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(GAME_WIDTH / 2 + 50, towerY)
  ctx.lineTo(GAME_WIDTH / 2 + 70, towerY - 26)
  ctx.lineTo(GAME_WIDTH / 2 + 90, towerY)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#3f2a52'
  ctx.fillRect(0, GROUND_Y - 12, GAME_WIDTH, 12)
}

function renderSea(ctx) {
  fillSky(ctx, '#8fd3ff', '#e6f7ff')

  ctx.fillStyle = '#fde68a'
  ctx.beginPath()
  ctx.arc(90, 90, 30, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#0ea5e9'
  ctx.fillRect(0, GROUND_Y - 90, GAME_WIDTH, 90)

  ctx.strokeStyle = 'rgba(255,255,255,0.6)'
  ctx.lineWidth = 3
  for (let i = 0; i < 3; i++) {
    const y = GROUND_Y - 70 + i * 20
    ctx.beginPath()
    for (let x = 0; x <= GAME_WIDTH; x += 20) {
      const offset = Math.sin(x * 0.05 + i) * 4
      if (x === 0) ctx.moveTo(x, y + offset)
      else ctx.lineTo(x, y + offset)
    }
    ctx.stroke()
  }
}

const RENDERERS = {
  mountain: renderMountain,
  lake: renderLake,
  castle: renderCastle,
  sea: renderSea,
}

export function renderBackground(ctx, theme) {
  const renderer = RENDERERS[theme] ?? renderMountain
  renderer(ctx)

  ctx.fillStyle = '#111'
  ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y)
}
