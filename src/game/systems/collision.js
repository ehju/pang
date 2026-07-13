import { HARPOON_WIDTH, BALLOON_RADII, ITEM_SIZE } from '../constants'

export function harpoonHitsBalloon(harpoon, balloon) {
  const radius = BALLOON_RADII[balloon.stage]
  const harpoonCenterX = harpoon.x + HARPOON_WIDTH / 2

  const withinX = Math.abs(balloon.x - harpoonCenterX) <= radius
  const withinY = balloon.y + radius >= harpoon.y && balloon.y - radius <= harpoon.startY

  return withinX && withinY
}

export function playerHitsBalloon(player, balloon) {
  const radius = BALLOON_RADII[balloon.stage]

  const closestX = Math.max(player.x, Math.min(balloon.x, player.x + player.width))
  const closestY = Math.max(player.y, Math.min(balloon.y, player.y + player.height))

  const dx = balloon.x - closestX
  const dy = balloon.y - closestY

  return dx * dx + dy * dy <= radius * radius
}

export function harpoonHitsObstacle(harpoon, obstacle) {
  const withinX =
    harpoon.x + HARPOON_WIDTH >= obstacle.x && harpoon.x <= obstacle.x + obstacle.width
  const withinY = harpoon.y <= obstacle.y + obstacle.height && harpoon.y >= obstacle.y

  return withinX && withinY
}

export function playerHitsItem(player, item) {
  const itemLeft = item.x - ITEM_SIZE / 2
  const itemRight = item.x + ITEM_SIZE / 2
  const itemTop = item.y - ITEM_SIZE / 2
  const itemBottom = item.y + ITEM_SIZE / 2

  return (
    player.x < itemRight &&
    player.x + player.width > itemLeft &&
    player.y < itemBottom &&
    player.y + player.height > itemTop
  )
}

// 원의 바운딩 박스를 사각형으로 근사해 겹침이 가장 얕은 축으로 밀어내고 반사한다.
export function resolveBalloonObstacleCollision(balloon, obstacle) {
  const radius = BALLOON_RADII[balloon.stage]

  const overlapLeft = balloon.x + radius - obstacle.x
  const overlapRight = obstacle.x + obstacle.width - (balloon.x - radius)
  const overlapTop = balloon.y + radius - obstacle.y
  const overlapBottom = obstacle.y + obstacle.height - (balloon.y - radius)

  if (overlapLeft <= 0 || overlapRight <= 0 || overlapTop <= 0 || overlapBottom <= 0) {
    return false
  }

  const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom)

  if (minOverlap === overlapTop) {
    balloon.y = obstacle.y - radius
    balloon.vy = -Math.abs(balloon.vy)
  } else if (minOverlap === overlapBottom) {
    balloon.y = obstacle.y + obstacle.height + radius
    balloon.vy = Math.abs(balloon.vy)
  } else if (minOverlap === overlapLeft) {
    balloon.x = obstacle.x - radius
    balloon.vx = -Math.abs(balloon.vx)
  } else {
    balloon.x = obstacle.x + obstacle.width + radius
    balloon.vx = Math.abs(balloon.vx)
  }

  return true
}
