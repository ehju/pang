import { GAME_WIDTH } from '../constants'

export const MISSION_1 = {
  name: 'Mission 1',
  timeLimit: 120, // seconds, generous per docs/features/mission.md
  balloons: [{ x: GAME_WIDTH / 2, y: 100, vx: 80, vy: 0, stage: 0 }],
  obstacles: [{ x: GAME_WIDTH / 2 - 80, y: 380, width: 160, height: 20 }],
  timePenaltyBalloon: { x: GAME_WIDTH / 2, y: 60, vx: 80, vy: 0, stage: 0 },
}
