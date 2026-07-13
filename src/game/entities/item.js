import { GROUND_Y, ITEM_SIZE, ITEM_FALL_SPEED } from '../constants'

const ITEM_TYPES = ['extra-life', 'rapid-fire']
const ITEM_COLORS = {
  'extra-life': '#facc15',
  'rapid-fire': '#38bdf8',
}

export function pickRandomItemType() {
  return ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)]
}

export function createItem({ x, y, type }) {
  return { x, y, type }
}

export function updateItems(items, dt) {
  for (const item of items) {
    item.y += ITEM_FALL_SPEED * dt
  }

  return items.filter((item) => item.y + ITEM_SIZE / 2 < GROUND_Y)
}

function drawHeart(ctx, cx, cy, size) {
  ctx.beginPath()
  ctx.moveTo(cx, cy + size * 0.3)
  ctx.bezierCurveTo(
    cx - size * 0.5,
    cy - size * 0.2,
    cx - size * 0.2,
    cy - size * 0.6,
    cx,
    cy - size * 0.25,
  )
  ctx.bezierCurveTo(
    cx + size * 0.2,
    cy - size * 0.6,
    cx + size * 0.5,
    cy - size * 0.2,
    cx,
    cy + size * 0.3,
  )
  ctx.fill()
}

function drawLightning(ctx, cx, cy, size) {
  ctx.beginPath()
  ctx.moveTo(cx + size * 0.1, cy - size * 0.5)
  ctx.lineTo(cx - size * 0.3, cy + size * 0.05)
  ctx.lineTo(cx, cy + size * 0.05)
  ctx.lineTo(cx - size * 0.1, cy + size * 0.5)
  ctx.lineTo(cx + size * 0.3, cy - size * 0.05)
  ctx.lineTo(cx, cy - size * 0.05)
  ctx.closePath()
  ctx.fill()
}

export function renderItems(ctx, items) {
  for (const item of items) {
    ctx.fillStyle = ITEM_COLORS[item.type]

    if (item.type === 'extra-life') {
      drawHeart(ctx, item.x, item.y, ITEM_SIZE)
    } else if (item.type === 'rapid-fire') {
      drawLightning(ctx, item.x, item.y, ITEM_SIZE)
    }
  }
}
