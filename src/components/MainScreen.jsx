import { GAME_WIDTH, GAME_HEIGHT } from '../game/constants'
import { initAudio } from '../game/audio'
import PangIntroArt from './PangIntroArt'
import PangTitle from './PangTitle'

function MainScreen({ onStart }) {
  function handleStart() {
    initAudio()
    onStart()
  }

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
      <PangTitle />
      <button type="button" onClick={handleStart}>
        시작하기
      </button>
    </div>
  )
}

export default MainScreen
