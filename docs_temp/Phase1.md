# Phase 1 — 메인 화면 (상세 구현 계획)

[docs_temp/Phases_goal.md](Phases_goal.md)의 Phase 1 목표와
[docs/features/main.md](../docs/features/main.md)의 메인 화면 스펙을 기반으로 한
상세 구현 계획이다. Phase 0에서 만든 `GameCanvas`(캔버스 렌더링 루프 + 입력 스캐폴드)는
그대로 두고, 그 앞단에 타이틀 화면을 붙여 "메인 화면 → 게임 화면" 전환 흐름을 만드는
것이 이번 Phase의 목적이다.

## 목표

- 타이틀 + 시작하기 버튼으로 구성된 최소한의 메인 화면을 구현한다.
- 시작하기 버튼을 누르면 게임 화면(현재는 Phase 0의 디버그 캔버스)으로 전환된다.
- 화면 전환 시 이전 화면의 리소스(입력 리스너, 게임 루프)가 확실히 정리된다.

## 1. 화면 전환 방식: 별도 라우터 없이 상태 기반 전환

- 현재 화면은 "메인"과 "게임" 두 가지뿐이므로 `react-router` 같은 라우팅 라이브러리를
  도입하지 않고, `App.jsx`에서 `useState`로 현재 화면을 관리한다.
- `App.jsx`가 화면 스위처 역할을 담당한다:

  ```jsx
  function App() {
    const [screen, setScreen] = useState('main') // 'main' | 'game'

    if (screen === 'game') {
      return <GameCanvas />
    }
    return <MainScreen onStart={() => setScreen('game')} />
  }
  ```

- 스테이지가 여러 개로 늘어나거나(Phase 5 이후) 화면 종류가 많아지면 그때 라우팅
  도입 여부를 재검토한다 (Phase 0/1 시점에서는 과설계를 피한다).

## 2. 메인 화면 컴포넌트: DOM 기반

- Phase 0에서 "게임 플레이 렌더링은 canvas, 그 외 UI는 DOM"이라는 원칙을 세웠다.
  메인 화면은 게임 플레이 렌더링이 아니므로 canvas가 아닌 **일반 React DOM
  컴포넌트**로 구현한다 (버튼 클릭 이벤트, 접근성, 스타일링이 DOM 쪽이 훨씬 쉽다).
- 새 컴포넌트: `src/components/MainScreen.jsx`
  - `main.md`의 "초기 버전은 타이틀 + 시작하기 버튼 정도의 최소 구성" 범위 메모에
    따라 아래만 구현한다:
    - 게임 타이틀 텍스트/로고 (`<h1>PANG</h1>` 수준의 텍스트로 시작, 실제 로고 이미지는
      추후 에셋 준비 시 교체)
    - "시작하기" 버튼 → `onStart` prop 호출
  - 조작법 안내, 최고 점수, 설정 진입은 `main.md`에 "선택/추후 확장"으로 명시되어
    있으므로 Phase 1에서는 구현하지 않는다.
- 레이아웃은 Phase 0에서 정한 게임 논리 해상도(`GAME_WIDTH`/`GAME_HEIGHT`, 480x640)와
  시각적으로 맞춰 캔버스 화면과 크기 체감이 비슷하도록 중앙 정렬 박스 형태로 구성한다.

## 3. 컴포넌트 구조 (제안)

```
src/
  App.jsx               # 화면 상태(screen)를 들고 MainScreen ↔ GameCanvas 전환
  components/
    MainScreen.jsx       # 타이틀 + 시작하기 버튼 (신규)
    GameCanvas.jsx        # Phase 0에서 구현된 게임 캔버스 (변경 없음)
  game/
    constants.js / input.js / loop.js   # 변경 없음
```

## 4. 화면 전환 시 리소스 정리

- `GameCanvas`는 이미 Phase 0에서 `useEffect` cleanup으로 `loop.stop()` /
  `detachInput()`을 호출하도록 구현되어 있다. `screen` 상태가 `'main'` → `'game'`으로
  바뀌며 `GameCanvas`가 마운트되고, 반대로 게임에서 메인으로 돌아가는 경우(이번 Phase
  범위 밖이지만) 언마운트되면 자동으로 루프와 입력 리스너가 정리된다.
- Phase 1에서는 메인 → 게임 단방향 전환만 구현하므로 별도 정리 로직 추가는 필요
  없으나, 향후 "메인으로 돌아가기" 기능이 생겨도 기존 cleanup 구조만으로 안전하게
  동작함을 확인해둔다.

## 5. 완료(Done) 기준

- `npm run dev` 실행 시 캔버스가 아니라 타이틀 문구와 "시작하기" 버튼이 있는 메인
  화면이 먼저 보인다.
- "시작하기" 버튼을 클릭하면 Phase 0에서 만든 캔버스 화면(디버그 사각형 + 방향키
  이동)으로 전환된다.
- 전환 후에도 방향키 입력이 정상 동작한다 (입력 리스너가 새로 붙었는지 확인).
- 브라우저 새로고침 시 다시 메인 화면부터 시작한다 (상태가 컴포넌트 로컬 상태이므로
  당연히 초기화됨 — 별도 영속화는 범위 밖).
- 콘솔 에러 없음.

## 6. Phase 1 이후 연결

- Phase 5(스테이지/Mission 시스템)에서 `GameCanvas`가 실제 Mission 1 데이터를 로드하게
  되면, `App.jsx`의 전환 로직에 "클리어 후 결과 화면" 등 추가 상태가 늘어날 수 있다.
  이때 화면 종류가 3개 이상으로 늘어나면 상태값을 문자열 enum에서 좀 더 명시적인
  구조로 리팩터링할지 검토한다.
- 최고 점수/설정 등 `main.md`의 확장 항목은 해당 기능이 실제로 필요해지는 시점
  (Phase 8 UI/UX 다듬기 전후)에 별도로 설계한다.
