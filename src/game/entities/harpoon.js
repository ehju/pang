import {
  HARPOON_WIDTH,
  HARPOON_SPEED,
  HARPOON_COOLDOWN,
  HARPOON_COOLDOWN_RAPID,
  MAX_HARPOONS,
  RAPID_FIRE_DURATION,
} from '../constants'
import { isPressed } from '../input'
import { harpoonHitsObstacle } from '../systems/collision'

export function createHarpoonSystem() {
  return {
    harpoons: [],
    cooldownRemaining: 0,
    wasFirePressed: false,
    rapidFireRemaining: 0,
  }
}

export function applyRapidFire(system) {
  system.rapidFireRemaining = RAPID_FIRE_DURATION
}

function spawnHarpoon(system, player) {
  system.harpoons.push({
    x: player.x + player.width / 2 - HARPOON_WIDTH / 2,
    y: player.y,
    startY: player.y,
  })
  system.cooldownRemaining = system.rapidFireRemaining > 0 ? HARPOON_COOLDOWN_RAPID : HARPOON_COOLDOWN
}

export function updateHarpoons(system, player, obstacles, dt) {
  const firePressed = isPressed('fire')
  const firePressedThisFrame = firePressed && !system.wasFirePressed
  system.wasFirePressed = firePressed

  if (system.cooldownRemaining > 0) system.cooldownRemaining -= dt
  if (system.rapidFireRemaining > 0) system.rapidFireRemaining -= dt

  if (
    firePressedThisFrame &&
    system.cooldownRemaining <= 0 &&
    system.harpoons.length < MAX_HARPOONS
  ) {
    spawnHarpoon(system, player)
  }

  for (const harpoon of system.harpoons) {
    harpoon.y -= HARPOON_SPEED * dt
    harpoon.x = player.x + player.width / 2 - HARPOON_WIDTH / 2
  }

  system.harpoons = system.harpoons.filter((harpoon) => {
    if (harpoon.y <= 0) return false

    const blockingObstacle = obstacles.find((obstacle) => harpoonHitsObstacle(harpoon, obstacle))
    if (blockingObstacle) {
      harpoon.y = blockingObstacle.y + blockingObstacle.height
      return false
    }

    return true
  })
}

export function renderHarpoons(ctx, system) {
  ctx.fillStyle = '#facc15'
  for (const harpoon of system.harpoons) {
    ctx.fillRect(harpoon.x, harpoon.y, HARPOON_WIDTH, harpoon.startY - harpoon.y)
  }
}
