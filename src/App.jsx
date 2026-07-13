import { useState } from 'react'
import GameCanvas from './components/GameCanvas'
import MainScreen from './components/MainScreen'

function App() {
  const [screen, setScreen] = useState('main')

  if (screen === 'game') {
    return <GameCanvas />
  }

  return <MainScreen onStart={() => setScreen('game')} />
}

export default App
