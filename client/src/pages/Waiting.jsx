import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSocket } from '../components/SocketProvider';
import { error, success } from '../App';
import QRCode from 'qrcode';
import './Waiting.css';
import Loader from './Loader';

const Waiting = () => {
  const [roomid, setRoomid] = useState(sessionStorage.getItem('room') || '');
  const [path, setPath] = useState('/join_via_link/');
  const [showqr, setShowqr] = useState(false);
  const [txt, setTxt] = useState('Genrating The QRCode.')
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [showloader, setShowloader] = useState(false);

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

  const handleDestroy = () => {
    setShowloader(true);
    socket.emit('destroyRoom', roomid);
  }

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join My Game",
          text: "Click the Invite link to join my game!",
          url: (window.location.origin + path + roomid)
        });
        success("Link shared successfully!");
      } catch (err) {
        console.error(err.message);
      }
    } else {
      error('Your browser does not support Web Share API.')
    }
  }

  useEffect(() => {
    if (!sessionStorage.getItem('wait')) {
      navigate("/");
    }

    if (sessionStorage.getItem('player') && sessionStorage.getItem('room')) {
      navigate(`/game_home/${sessionStorage.getItem('room')}`);
    }

    if (!socket) return;

    setRoomid(sessionStorage.getItem('room'));

    QRCode.toCanvas(document.getElementById("canvas"), window.location.origin + path + roomid, {
      width: window.innerWidth < 600 ? 180 : 300,
      color: {
        dark: "#ffffff",
        light: "#e854dbff"
      }
    }, function (er) {
      if (er) {
        setTxt('QRCode is not Genrating At This Time :( ');
        return;
      }
      setShowqr(true);
    });

    socket.on('partnerJoined', () => {
      socket.emit('takeInfo', { roomid: sessionStorage.getItem('room') });
    });

    socket.emit('takeInfo', { roomid: sessionStorage.getItem('room') });

    socket.on('getInfo', (data) => {
      if (data.isMatchStart) {
        sessionStorage.setItem('player', data.pl1);
        navigate(`/game_home/${sessionStorage.getItem('room')}`);
      }
    });

    socket.on('goToHome', () => {
      navigate('/');
    });

    socket.on('serverErr', () => {
      error('Server Error! Please try again later.');
    })

    return () => {
      socket.off('partnerJoined');
      socket.off('getInfo');
      socket.off('goToHome');
      socket.off('serverErr');
    };
  }, [socket]);

  return (
    <>
      <div className="waiting-container">
        {showloader ? <Loader text='Destroying Your Private Game Room.' /> : ''}
        <div className="wrapper">
          <div className="main-heading">
            Waiting For Your Game Partner!
          </div>
          <div className="middle">
            <div className="left-side">
              <div className="gif_area">
                <canvas id="canvas" style={{ display: showqr ? '' : 'none' }} draggable={true}></canvas>
                <div className="loader" style={{ display: showqr ? 'none' : '' }}>
                  <div className="outer-loader">
                    <div className="inner-loader"></div>
                  </div>
                  <div className="text">{txt}</div>
                </div>
              </div>
            </div>
            <div className="right-side">
              <div className="description">
                We waits here for your friend to join the private game. Once both players are connected, the game starts automatically. A simple real-time lobby to begin the match smoothly.
              </div>
              <div className="room-id description">RoomID is : <span onClick={handleClick} className='room-id'>{roomid}</span></div>
              <div className="btn-area">
                <div className="shre-btn">
                  <button onClick={handleShareClick}>Share Link</button>
                </div>
                <div className="shre-btn">
                  <Link to={"/"} className='btn' onClick={handleDestroy} >Destroy Room</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Waiting