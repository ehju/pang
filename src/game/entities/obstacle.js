export function createObstacle({ x, y, width, height }) {
  return { x, y, width, height }
}

export function renderObstacle(ctx, obstacle) {
  ctx.fillStyle = '#6b7280'
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
}
