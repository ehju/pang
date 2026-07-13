export const GAME_WIDTH = 480
export const GAME_HEIGHT = 640
export const GROUND_Y = 600

export const PLAYER_WIDTH = 32
export const PLAYER_HEIGHT = 32
export const PLAYER_SPEED = 200 // px per second

export const HARPOON_WIDTH = 4
export const HARPOON_SPEED = 500 // px per second
export const HARPOON_COOLDOWN = 0.3 // seconds
export const MAX_HARPOONS = 2

export const GRAVITY = 400 // px per second squared
export const BALLOON_RADII = [40, 26, 15] // 대, 중, 소
export const BALLOON_SPLIT_VY = -350 // 분열 시 위로 튀는 초기 속도
export const BALLOON_SPLIT_VX = 100 // 분열된 풍선의 좌우 속도 크기

export const PLAYER_LIVES_INITIAL = 3
export const PLAYER_INVULNERABLE_TIME = 1.5 // seconds

export const ITEM_SIZE = 16
export const ITEM_DROP_CHANCE = 0.35
export const ITEM_FALL_SPEED = 60 // px per second

export const RAPID_FIRE_DURATION = 6 // seconds
export const HARPOON_COOLDOWN_RAPID = 0.1 // seconds

export const SCORE_PER_HIT = [100, 150, 200] // 대, 중, 소

export const STAGE_BALLOON_COUNT_STEP = 1 // 스테이지당 늘어나는 풍선 개수
export const STAGE_SPEED_MULTIPLIER_STEP = 0.15 // 스테이지당 증가하는 속도 배율

export const CLEAR_COUNTDOWN_DURATION = 3 // seconds before auto-advancing to next stage
