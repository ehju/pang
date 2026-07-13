# Phase 2 — 플레이어 이동 및 작살 발사 (상세 구현 계획)

[docs_temp/Phases_goal.md](Phases_goal.md)의 Phase 2 목표를 구현하기 위한 상세
계획이다. Phase 0에서 만든 게임 루프/입력 스캐폴드와 디버그 사각형을 실제
플레이어 엔티티로 교체하고, 여기에 작살(harpoon) 발사 시스템을 추가한다. 풍선은
아직 존재하지 않으므로(Phase 3) 이번 Phase에서는 작살이 화면 상단에 닿으면
사라지는 것까지만 구현한다.

## 목표

- 디버그 사각형을 실제 플레이어 엔티티로 교체하고, 좌우 이동을 구현한다.
- 스페이스바(fire)로 수직 작살을 발사한다.
- 작살은 화면 상단(또는 이후 Phase 4의 장애물)에 닿을 때까지 위로 이동하다가
  사라진다.
- 발사 쿨타임과 동시 발사 가능 개수를 제한해 무한 발사를 막는다.

## 1. 엔티티 모듈 분리

Phase 0에서 `GameCanvas.jsx`에 디버그 로직을 직접 넣었던 것과 달리, 플레이어/작살은
이후 Phase(풍선, 충돌 등)와 상태를 주고받아야 하므로 순수 로직을 `src/game/entities/`
아래로 분리한다.

```
src/game/
  entities/
    player.js    # 플레이어 상태 + update 로직
    harpoon.js   # 작살 상태 리스트 + spawn/update 로직
  constants.js   # 이동 속도, 발사 쿨타임 등 상수 추가
  input.js       # 변경 없음 (Phase 0에서 이미 fire 액션 매핑됨)
  loop.js        # 변경 없음
```

- `GameCanvas.jsx`는 각 모듈의 `update`/`render`를 호출하는 오케스트레이션 역할만
  담당하고, 엔티티 내부 상태(위치, 속도 등)는 모듈 내부에 캡슐화한다.

## 2. 플레이어 (`player.js`)

- 상태: `{ x, y, width, height }`
  - `y`는 고정값(바닥 근처, 예: `GROUND_Y - PLAYER_HEIGHT`)로 두고 좌우 이동만 허용한다
    (PRD 3.2: "점프나 상하 이동은 제한적" — Phase 2 범위에서는 상하 이동 자체를
    구현하지 않는다).
  - `x`는 `0 ~ GAME_WIDTH - width` 범위로 클램프한다 (Phase 0 디버그 박스와 동일한
    패턴).
- `update(dt, input)`:
  - `input.isPressed('left')` / `('right')`에 따라 `PLAYER_SPEED * dt`만큼 `x` 갱신
  - 좌우 동시 입력 시 서로 상쇄되어 정지 (Phase 0 검증 때 확인한 것과 동일한 자연스러운
    동작)
- `render(ctx)`: 단색 사각형으로 표시 (예: 파란 계열, 작살/풍선과 색 구분)

## 3. 작살 (`harpoon.js`)

- 상태: 발사된 작살들의 배열. 각 작살은 `{ x, y }` (폭은 고정 상수, 위치만 매 프레임
  갱신).
- 발사 로직:
  - `fire` 입력이 **눌리는 순간**(눌려있는 동안 계속이 아니라 rising edge)에만 새
    작살을 생성한다. 이를 위해 `input.js`에 rising-edge 감지가 없으므로, harpoon 모듈
    또는 GameCanvas 쪽에서 이전 프레임의 `fire` 상태를 기억해 비교한다 (`wasFirePressed`).
  - 발사 조건: `현재 화면에 존재하는 작살 개수 < MAX_HARPOONS` AND `쿨타임 경과`.
  - 발사 위치: 플레이어의 x 중심, y는 플레이어 상단.
- `update(dt)`:
  - 모든 작살의 `y -= HARPOON_SPEED * dt`
  - `y <= 0`이 된 작살은 배열에서 제거한다 (화면 상단 도달 시 소멸 — 이후 Phase 4에서
    장애물 충돌 시 제거 조건이 추가될 예정).
- `render(ctx)`: 얇은 세로 사각형(라인)으로 표시.

## 4. 상수 추가 (`constants.js`)

기존 `GAME_WIDTH`, `GAME_HEIGHT`, `GROUND_Y`에 다음을 추가한다 (구체적인 수치는
PRD/rules.md에 명시되어 있지 않으므로 플레이 테스트로 조정 가능한 초기값으로 설정):

- `PLAYER_WIDTH`, `PLAYER_HEIGHT`
- `PLAYER_SPEED` (px/s)
- `HARPOON_WIDTH`
- `HARPOON_SPEED` (px/s, 플레이어보다 빠르게)
- `HARPOON_COOLDOWN` (초 단위, 예: 0.3)
- `MAX_HARPOONS` (동시 발사 가능 개수, 예: 2 — [docs/features/rules.md](../docs/features/rules.md#조작)의
  "발사 속도, 동시 발사 가능 개수... 아이템으로 강화" 문구를 참고한 초기 기본값)

## 5. GameCanvas 통합

- 기존 디버그 박스 관련 코드(`debugBox`, `DEBUG_BOX_*`)를 제거한다.
- `useEffect` 내부에서:
  - `player` 상태와 `harpoons` 배열을 생성
  - `update(dt)`: `player.update(dt, input)` → `harpoons.update(dt)` → 발사 조건 체크 후
    필요 시 `harpoons.spawn(player)` 순서로 호출
  - `render()`: 배경 → 작살 → 플레이어 순으로 그린다 (Phase 3부터는 여기에 풍선 렌더링이
    추가될 예정)

## 6. 완료(Done) 기준

- 방향키/`A`·`D`로 플레이어(사각형)가 좌우로 이동하고 화면 밖으로 나가지 않는다.
- 스페이스바를 누르면 플레이어 위치에서 작살이 발사되어 위로 이동하다가 화면 상단에서
  사라진다.
- 스페이스바를 계속 누르고 있어도 쿨타임/최대 개수 제한에 따라 일정 간격으로만
  발사된다 (연사 방지).
- `MAX_HARPOONS`개의 작살이 화면에 떠 있는 동안에는 추가 발사가 되지 않다가, 하나가
  사라지면 다시 발사 가능해진다.
- 콘솔 에러 없음.

## 7. Phase 2 이후 연결

- Phase 3(풍선 물리 및 분열)에서 작살과 풍선의 충돌 판정이 추가되며, 작살은 화면
  상단 도달 외에 "풍선과 충돌"로도 제거될 수 있다.
- Phase 4(장애물)에서 작살이 장애물에 막혀 그 지점에서 소멸하는 조건이 추가된다.
- 발사 쿨타임/최대 개수 등의 수치는 Phase 7(아이템)에서 파워업으로 강화되는 지점과
  연결되므로, 지금은 상수로 두되 이후 "플레이어 강화 상태"로 감쌀 수 있도록 player
  모듈에 하드코딩하지 않고 constants.js에서 참조하는 형태를 유지한다.
