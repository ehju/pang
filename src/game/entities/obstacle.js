const BRICK_WIDTH = 24
const BRICK_HEIGHT = 10
const MORTAR = 2
const BRICK_COLORS = ['#b91c1c', '#991b1b', '#7f1d1d']

export function createObstacle({ x, y, width, height }) {
  return { x, y, width, height }
}

export function renderObstacle(ctx, obstacle) {
  const { x, y, width, height } = obstacle

  ctx.fillStyle = '#d6d3d1'
  ctx.fillRect(x, y, width, height)

  const rows = Math.ceil(height / BRICK_HEIGHT)

  for (let row = 0; row < rows; row++) {
    const rowY = y + row * BRICK_HEIGHT
    const rowHeight = Math.min(BRICK_HEIGHT, y + height - rowY) - MORTAR
    if (rowHeight <= 0) continue

    const rowOffset = row % 2 === 0 ? 0 : -BRICK_WIDTH / 2

    for (let bx = x + rowOffset; bx < x + width; bx += BRICK_WIDTH) {
      const brickX = Math.max(bx, x)
      const brickRight = Math.min(bx + BRICK_WIDTH - MORTAR, x + width)
      const brickWidth = brickRight - brickX
      if (brickWidth <= 0) continue

      const colorIndex = Math.floor(brickX * 7 + rowY * 13) % BRICK_COLORS.length
      ctx.fillStyle = BRICK_COLORS[colorIndex]
      ctx.fillRect(brickX, rowY, brickWidth, rowHeight)
    }
  }
}
