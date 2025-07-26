import { Route, Routes } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import Join_room from './pages/Join_room'
import Home from './pages/Home'
import Game_home from './pages/Game_home'
import Create_room from './pages/Create_room'
import './App.css'
import Waiting from './pages/Waiting'

const closeButton = (t, color) => (
  <button
    onClick={() => toast.dismiss(t.id)}
    style={{
      border: 'none',
      background: 'transparent',
      color,
      fontSize: '16px',
      cursor: 'pointer',
      marginLeft: '12px',
    }}
  >
    &times;
  </button>
);

export const success = (message) =>
  toast.custom((t) => (
    <div
      style={{
        background: '#d1e7dd',
        color: '#0f5132',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        maxWidth: '350px',
        fontSize: '14px',
      }}
    >
      ✅ {message}
      {closeButton(t, '#0f5132')}
    </div>
  ));

export const error = (message) =>
  toast.custom((t) => (
    <div
      style={{
        background: '#f8d7da',
        color: '#842029',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        maxWidth: '350px',
        fontSize: '14px',
      }}
    >
      ❌ {message}
      {closeButton(t, '#842029')}
    </div>
  ));

export const warning = (message) =>
  toast.custom((t) => (
    <div
      style={{
        background: '#fff3cd',
        color: '#664d03',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        maxWidth: '350px',
        fontSize: '14px',
      }}
    >
      ⚠️ {message}
      {closeButton(t, '#664d03')}
    </div>
  ));

function App() {

  return (
    <>
      <Toaster
        position='bottom-left'
        reverseOrder={false}
        duration={2000}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join_room" element={<Join_room />} />
        <Route path="/create_room" element={<Create_room />} />
        <Route path="/game_home" element={<Game_home />} />
        <Route path="/waiting_area" element={<Waiting />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  )
}

export default App