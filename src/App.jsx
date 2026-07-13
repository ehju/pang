import { useState } from 'react'
import GameCanvas from './components/GameCanvas'
import MainScreen from './components/MainScreen'
import { isMuted, setMuted } from './game/audio'

function App() {
  const [screen, setScreen] = useState('main')
  const [gameKey, setGameKey] = useState(0)
  const [muted, setMutedState] = useState(isMuted())

  function toggleMute() {
    const next = !muted
    setMuted(next)
    setMutedState(next)
  }

  function handleRestart() {
    setGameKey((key) => key + 1)
  }

  function handleExit() {
    setScreen('main')
  }

  return (
    <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto' }}>
      <button
        type="button"
        onClick={toggleMute}
        style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
      >
        {muted ? '🔇' : '🔊'}
      </button>
      {screen === 'game' ? (
        <GameCanvas key={gameKey} onRestart={handleRestart} onExit={handleExit} />
      ) : (
        <MainScreen onStart={() => setScreen('game')} />
      )}
    </div>
  )
}

export default App
