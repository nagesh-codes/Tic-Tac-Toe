import { Route, Routes } from 'react-router-dom'
import './App.css'
import Join_room from './components/Join_room'
import Home from './components/Home'
import Game_home from './components/Game_home'
import Create_room from './components/Create_room'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join_room" element={<Join_room />} />
        <Route path="/create_room" element={<Create_room />} />
        <Route path="/game_home" element={<Game_home />} />
      </Routes>
    </>
  )
}

export default App
