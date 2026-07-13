import { GAME_WIDTH, GAME_HEIGHT } from '../game/constants'
import PangIntroArt from './PangIntroArt'

function MainScreen({ onStart }) {
  return (
    <div
      style={{
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        background: '#111',
        color: '#fff',
        border: '1px solid #333',
      }}
    >
      <PangIntroArt />
      <h1 style={{ margin: 0 }}>PANG</h1>
      <button type="button" onClick={onStart}>
        시작하기
      </button>
    </div>
  )
}

export default MainScreen
