import { GROUND_Y, ITEM_SIZE, ITEM_LIFETIME, ITEM_FALL_SPEED } from '../constants'

const ITEM_TYPES = ['extra-life', 'rapid-fire']
const ITEM_COLORS = {
  'extra-life': '#facc15',
  'rapid-fire': '#38bdf8',
}

export function pickRandomItemType() {
  return ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)]
}

export function createItem({ x, y, type }) {
  return { x, y, type, timeRemaining: ITEM_LIFETIME }
}

export function updateItems(items, dt) {
  for (const item of items) {
    if (item.y + ITEM_SIZE < GROUND_Y) {
      item.y += ITEM_FALL_SPEED * dt
    }
    item.timeRemaining -= dt
  }

  return items.filter((item) => item.timeRemaining > 0)
}

export function renderItems(ctx, items) {
  for (const item of items) {
    ctx.fillStyle = ITEM_COLORS[item.type]
    ctx.fillRect(item.x - ITEM_SIZE / 2, item.y - ITEM_SIZE / 2, ITEM_SIZE, ITEM_SIZE)
  }
}
