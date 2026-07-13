# Phase 5 — 스테이지(Mission) 시스템 (상세 구현 계획)

[docs_temp/Phases_goal.md](Phases_goal.md)의 Phase 5 목표와
[docs/features/mission.md](../docs/features/mission.md)의 Mission 1 스펙을 구현한다.
Phase 3/4에서 `GameCanvas.jsx`에 하드코딩해두었던 테스트용 풍선/장애물 스폰을
**스테이지 데이터 모듈**로 옮기고, "모든 풍선 제거 시 클리어"라는 명확한 판정을
추가한다. `mission.md`에 언급된 아이템/제한 시간은 각각 Phase 7, Phase 6의 범위이므로
이번 Phase에서는 다루지 않는다.

## 목표

- Mission 1 스테이지 데이터를 별도 모듈로 정의한다 (풍선 초기 배치, 장애물 배치).
- `GameCanvas`가 하드코딩된 스폰 대신 스테이지 데이터를 읽어 초기화하도록 바꾼다.
- 화면 내 모든 풍선(분열된 풍선 포함)을 제거하면 "스테이지 클리어" 상태로 전환된다.
- 목숨 소진 시 게임 오버(Phase 3에서 이미 구현)와 스테이지 클리어가 서로 구분되어
  표시된다.

## 1. 스테이지 데이터 모듈 (`src/game/stages/mission1.js`)

- `mission.md`의 "풍선 구성: 큰 풍선 1~2개", "장애물: 없음 또는 최소 1개" 범위에
  맞춰 순수 데이터 객체로 정의한다:

  ```js
  export const MISSION_1 = {
    balloons: [
      { x: GAME_WIDTH / 2, y: 100, vx: 80, vy: 0, stage: 0 },
    ],
    obstacles: [
      { x: GAME_WIDTH / 2 - 80, y: 380, width: 160, height: 20 },
    ],
  }
  ```

- 스테이지가 현재 1개뿐이므로 별도의 "스테이지 목록/로더" 추상화(예: `stages/index.js`
  레지스트리)는 만들지 않는다 — 스테이지가 여러 개로 늘어나는 시점(이후 Phase 9
  폴리싱 또는 별도 확장)에 재검토한다. 지금은 `GameCanvas`가 `MISSION_1`을 직접
  import해서 사용한다.
- 좌표/장애물 값은 Phase 3~4에서 테스트용으로 쓰던 하드코딩 값을 그대로 옮겨온다
  (플레이 테스트로 검증된 값이므로 재조정 없이 재사용).

## 2. GameCanvas 통합

- 기존 `createInitialBalloons()` / `createInitialObstacles()` 함수를 제거하고,
  `MISSION_1.balloons` / `MISSION_1.obstacles`를 각각 `createBalloon` / `createObstacle`로
  매핑해 초기 상태를 만든다.
- 클리어 판정 추가:
  - 매 프레임 `update(dt)` 마지막에 `balloons.length === 0`이면 `cleared = true`로
    설정한다.
  - `gameOver`와 동일하게 `cleared` 상태에서는 `update`가 조기 반환되어 더 이상
    입력이 반영되지 않는다 (`if (gameOver || cleared) return`).
- 렌더링:
  - `cleared`일 때 "STAGE CLEAR" 문구를 표시한다 (게임 오버와 색상으로 구분,
    예: 초록색 `#4ade80`).
  - `gameOver`와 `cleared`는 동시에 발생하지 않는 배타적 상태이므로 (풍선이 모두
    사라진 후에는 더 이상 목숨이 깎일 수 없음) 렌더링 분기는 `if/else`로 처리한다.

## 3. 완료(Done) 기준

- `GameCanvas.jsx`에 하드코딩된 스폰 함수가 없고, `src/game/stages/mission1.js`의
  데이터를 사용한다.
- 게임 시작 시 Mission 1 데이터대로 풍선/장애물이 배치된다 (Phase 3/4에서 확인한
  것과 동일한 동작).
- 화면의 모든 풍선(분열로 생긴 풍선 포함)을 제거하면 "STAGE CLEAR"가 표시되고
  조작이 멈춘다.
- 목숨을 모두 잃으면 기존과 같이 "GAME OVER"가 표시된다.
- 콘솔 에러 없음.

## 4. Phase 5 이후 연결

- 스테이지가 2개 이상으로 늘어나면 `stages/mission1.js`와 같은 패턴의 모듈을
  추가하고, `GameCanvas`가 현재 스테이지 인덱스를 받아 해당 데이터를 로드하도록
  일반화한다 (그 시점에 스테이지 전환/다음 스테이지 로직도 함께 설계).
- Phase 6(난이도/진행)에서 제한 시간과 시간 초과 페널티를 이 스테이지 데이터
  구조에 필드로 추가할 수 있다 (예: `timeLimit`).
- Phase 7(아이템)에서 스테이지 데이터에 아이템 스폰 정보를 추가한다
  (`mission.md`의 "기본 아이템 1개" 요구사항).
