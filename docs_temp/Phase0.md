# Phase 0 — 프로젝트 기반 준비 (상세 구현 계획)

[docs_temp/Phases_goal.md](Phases_goal.md)의 Phase 0 목표를 실제로 구현하기 위한
상세 설계다. 이후 Phase(플레이어 이동, 풍선 물리 등)가 올라탈 수 있는 최소한의
뼈대를 만드는 것이 목적이며, 이 단계에서 실제 게임 규칙(풍선 분열, 아이템 등)은
구현하지 않는다.

## 목표

- 렌더링 방식을 결정하고 기본 렌더링 루프를 동작시킨다.
- 게임 화면의 크기/좌표계를 고정한다.
- 키보드 입력을 감지하고 조회할 수 있는 기반을 마련한다.
- 위 세 가지가 맞물려 동작하는지 확인할 수 있는 최소한의 디버그 결과물(예: 사각형이
  키 입력에 따라 움직이는 화면)을 만든다.

## 1. 렌더링 방식 결정: Canvas 기반

- PANG은 다수의 오브젝트(풍선, 작살, 파편)가 매 프레임 위치를 갱신하는 물리 기반
  게임이므로 DOM 노드 방식보다 **`<canvas>` 2D 렌더링**이 적합하다.
- React는 `<canvas>` 엘리먼트 마운트와 리액트 라이프사이클 관리까지만 담당하고,
  실제 프레임별 그리기는 canvas의 2D context API로 직접 처리한다 (React state로
  매 프레임을 리렌더링하지 않는다 — 성능 문제 방지).

## 2. 화면 레이아웃 및 좌표계

- 게임 논리 해상도를 고정한다. 예: `GAME_WIDTH = 480`, `GAME_HEIGHT = 640` (세로형,
  아케이드 원작 비율 참고).
- 좌표계: 원점 `(0, 0)`은 캔버스 좌상단, x는 오른쪽으로 증가, y는 아래로 증가
  (canvas 2D 기본 좌표계와 동일하게 유지해 변환 비용을 없앤다).
- 실제 화면 표시 크기는 CSS로 스케일링하되(`width/height` 스타일), 내부 로직은
  항상 논리 해상도 기준으로 계산한다. 이렇게 하면 이후 반응형 대응 시 로직 변경이
  필요 없다.
- 상수는 한 곳에 모아 관리한다: `src/game/constants.js`
  - `GAME_WIDTH`, `GAME_HEIGHT`, `GROUND_Y` 등

## 3. 게임 루프

- `requestAnimationFrame` 기반의 루프를 구성한다.
- 프레임 간 시간차(delta time)를 계산하여 이후 물리 연산(속도, 중력 등)이
  프레임레이트에 독립적으로 동작하도록 한다.
- 루프 구조 (의사 코드):

  ```js
  function loop(timestamp) {
    const dt = (timestamp - lastTimestamp) / 1000 // seconds
    lastTimestamp = timestamp

    update(dt)   // 게임 상태 갱신 (Phase 0에서는 디버그 오브젝트만)
    render(ctx)  // canvas에 그리기

    requestAnimationFrame(loop)
  }
  ```

- React 컴포넌트에서는 `useEffect`로 마운트 시 루프를 시작하고, 언마운트 시
  `cancelAnimationFrame`으로 정리한다 (StrictMode의 effect 이중 실행을 고려해
  루프 시작/정지가 멱등하도록 작성).
- update/render 분리 원칙을 유지해 이후 Phase에서 물리 로직만 갈아끼울 수 있게 한다.

## 4. 키보드 입력 처리

- 전역 `keydown`/`keyup` 리스너로 현재 눌려있는 키 상태를 추적하는 간단한
  입력 모듈을 만든다: `src/game/input.js`
  - 눌린 키를 `Set` 또는 boolean map에 저장 (예: `{ left: false, right: false, fire: false }`)
  - 키 매핑: `ArrowLeft`/`KeyA` → left, `ArrowRight`/`KeyD` → right, `Space` → fire
  - `isPressed(action)` 형태로 게임 루프의 `update(dt)`에서 조회
- 입력 모듈은 React 상태와 분리된 순수 모듈로 구현하여 매 프레임 리렌더링 없이
  값을 조회할 수 있게 한다.

## 5. 폴더 구조 (제안)

```
src/
  game/
    constants.js   # 게임 해상도 등 상수
    input.js       # 키보드 입력 상태 관리
    loop.js        # requestAnimationFrame 루프 유틸
  components/
    GameCanvas.jsx # <canvas> 마운트 + 루프 시작/정지 담당
  App.jsx          # GameCanvas를 렌더링 (Phase 1부터 메인 화면과 연결)
```

## 6. 완료(Done) 기준

- `npm run dev` 실행 시 고정 크기의 캔버스가 화면에 보인다.
- 캔버스 안에 디버그용 사각형(또는 원)이 하나 표시된다.
- 방향키(←/→ 또는 A/D)를 누르면 해당 사각형이 좌우로 이동한다 (실제 플레이어
  로직은 아니며, 입력 → 루프 → 렌더링 연결을 검증하기 위한 임시 코드).
- 브라우저 창 크기를 바꿔도 게임 내부 좌표계 계산에는 영향이 없다(스케일링만 발생).
- 콘솔에 렌더링/입력 관련 에러가 없다.

## 7. Phase 0 이후 연결

- Phase 1(메인 화면)에서 `GameCanvas`를 감싸는 화면 전환(타이틀 → 게임) 로직을 추가한다.
- Phase 2(플레이어 이동/발사)부터는 디버그 사각형을 실제 플레이어 엔티티로 교체하고,
  `input.js`에서 조회한 상태를 플레이어 이동/발사 로직에 연결한다.
