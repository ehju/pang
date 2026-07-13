import { HARPOON_WIDTH, BALLOON_RADII } from '../constants'

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
