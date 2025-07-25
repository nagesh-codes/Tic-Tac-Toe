import { useEffect } from 'react'
import cat1 from '../assets/cat1.gif'
import cat2 from '../assets/cat2.gif'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useSocket } from '../components/SocketProvider'
import { error } from '../App'
import './Waiting.css'

const Waiting = () => {
  const [roomid, setRoomid] = useState('')
  const navigate = useNavigate();
  const { socket } = useSocket();

  useEffect(() => {
    if (!sessionStorage.getItem('uni')) {
      navigate("/");
    }
    if (!socket) return;

    setRoomid(sessionStorage.getItem('room'));

    socket.on('partnerJoined', () => {
      socket.emit('takeInfo', { roomid: sessionStorage.getItem('room') });
    });

    socket.on('getInfo', (data) => {
      navigate('/game_home', { state: data });
    });

    socket.on('serverErr', () => {
      error('Server Error! Please try again later.');
    })

    return () => {
      socket.off('partnerJoined');
      socket.off('giveInfo');
      socket.off('getInfo');
      socket.off('serverErr');
    };
  }, [socket]);

  return (
    <>
      <div className="waiting-container">
        <div className="wrapper">
          <div className="main-heading">
            Waiting Area!
          </div>
          <div className="middle">
            <div className="left-side">
              <div className="gif_area">
                <img src={cat1} alt="Loading..." />
              </div>
            </div>
            <div className="right-side">
              <div className="description">
                The host waits here for a friend to join the private game. Once both players are connected, the game starts automatically. A simple real-time lobby to begin the match smoothly.
              </div>
              <div className="room-id description">RoomID is : <span>{roomid}</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Waiting