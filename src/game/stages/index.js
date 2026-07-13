import { GAME_WIDTH, STAGE_BALLOON_COUNT_STEP, STAGE_SPEED_MULTIPLIER_STEP } from '../constants'
import { MISSION_1 } from './mission1'

function generateStage(stageIndex) {
  const speedMultiplier = 1 + stageIndex * STAGE_SPEED_MULTIPLIER_STEP
  const balloonCount = MISSION_1.balloons.length + stageIndex * STAGE_BALLOON_COUNT_STEP

  const balloons = Array.from({ length: balloonCount }, (_, i) => {
    const direction = i % 2 === 0 ? 1 : -1
    return {
      x: GAME_WIDTH * ((i + 1) / (balloonCount + 1)),
      y: 100 + (i % 3) * 40,
      vx: direction * 80 * speedMultiplier,
      vy: 0,
      stage: 0,
    }
  })

  return {
    name: `Mission ${stageIndex + 1}`,
    timeLimit: MISSION_1.timeLimit,
    balloons,
    obstacles: MISSION_1.obstacles,
    timePenaltyBalloon: {
      ...MISSION_1.timePenaltyBalloon,
      vx: MISSION_1.timePenaltyBalloon.vx * speedMultiplier,
    },
  }
}

export function getStage(stageIndex) {
  return stageIndex === 0 ? MISSION_1 : generateStage(stageIndex)
}
