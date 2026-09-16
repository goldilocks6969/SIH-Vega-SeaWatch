import { SeaWatchMap } from './components/SeaWatchMap'
import { StyleBoard } from './internal/StyleBoard'
import './styles/map.css'
import './styles/entities.css'
import './styles/selection.css'
import './styles/agents.css'
import './styles/intelligence.css'
import './styles/hero.css'
import './styles/conversation.css'
import './styles/disaster.css'

function App() {
  const showStyleBoard = new URLSearchParams(window.location.search).has('styleboard')

  return showStyleBoard ? <StyleBoard /> : <SeaWatchMap />
}

export default App
