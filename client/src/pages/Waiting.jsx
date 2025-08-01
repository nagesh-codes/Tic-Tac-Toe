import { useEffect } from 'react'
import cat2 from '../assets/cat2.gif'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useSocket } from '../components/SocketProvider'
import { error, success } from '../App'
import './Waiting.css'

const Waiting = () => {
  const [roomid, setRoomid] = useState(sessionStorage.getItem('room') || '');
  const navigate = useNavigate();
  const { socket } = useSocket();

  const handleClick = () => {
    if (navigator && navigator.clipboard) {
      if (roomid == '') {
        error('Room ID not Found!');
      } else {
        navigator.clipboard.writeText(roomid)
          .then(() => success('Room ID Copied!'))
          .catch(() => error("Room ID wasn't copied."));
      }
    } else {
      error('Clipboard API not supported on this browser!');
    }
  }

  useEffect(() => {
    if (!sessionStorage.getItem('wait')) {
      navigate("/");
    }

    if (sessionStorage.getItem('player') && sessionStorage.getItem('room')) {
      navigate("/game_home");
    }

    if (!socket) return;

    setRoomid(sessionStorage.getItem('room'));

    socket.on('partnerJoined', () => {
      console.log('partener joined')
      socket.emit('takeInfo', { roomid: sessionStorage.getItem('room') });
    });

    socket.emit('takeInfo', { roomid: sessionStorage.getItem('room') });

    socket.on('getInfo', (data) => {
      console.log(data);
      if (data.isMatchStart) {
        sessionStorage.setItem('player', data.pl1);
        navigate('/game_home');
      }
    });

    socket.on('serverErr', () => {
      error('Server Error! Please try again later.');
    })

    return () => {
      socket.off('partnerJoined');
      socket.off('getInfo');
      socket.off('serverErr');
    };
  }, [socket]);

  return (
    <>
      <div className="waiting-container">
        <div className="wrapper">
          <div className="main-heading">
            Waiting For Your Game Partner!
          </div>
          <div className="middle">
            <div className="left-side">
              <div className="gif_area">
                <img src={cat2} alt="Loading..." />
              </div>
            </div>
            <div className="right-side">
              <div className="description">
                We waits here for your friend to join the private game. Once both players are connected, the game starts automatically. A simple real-time lobby to begin the match smoothly.
              </div>
              <div className="room-id description">RoomID is : <span onClick={handleClick} className='room-id'>{roomid}</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Waiting