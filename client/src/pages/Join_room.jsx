import { useState } from 'react';
import { Link } from 'react-router-dom'
import "./join_room.css"
import "../App.css"
import { useSocket } from '../components/SocketProvider';
import { useEffect } from 'react';
import { error, success, warning } from '../App';

const Entry = () => {
  const [roomid, setRoomid] = useState('');
  const [name, setName] = useState('');
  const { socket, connected } = useSocket();

  useEffect(() => {
    if (!socket && !connected) return;

    socket.on('roomNotAvailabel', () => { error('Such Room Is Not Available.') });

    socket.on('serverErr', () => { error('Internal Server Error') });

    socket.on('RoomJoin', () => {
      success('Successfully Joined The Room');
    })

    socket.on('changeName', () => {
      warning('This Name Is Already Taken By Room Creator, Please Choose Another Name');
    });

    return () => {
      socket.off('roomNotAvailabel');
      socket.off('serverErr');
      socket.off('RoomJoin');
      socket.off('changeName');
    }

  })

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('joinRoom', { name, roomid });
  }
  return (
    <>
      <div className="join-container">
        <div className="wrapper">
          <div className="main-heading">
            <h1>Join The Private Room</h1>
          </div>
          <div className="middle">

            <div className="left-side">
              <p className="description">
                Enter a unique private code to connect with your friends in a dedicated space. Simply type the code you've received into the input field and click "Join" to instantly access the room.
              </p>
              <p className="description hide">
                If you don't have a code, you can easily create your own private room and invite others to join you.
              </p>
              <p className="description hide">
                Join now and enjoy a fun-filled gaming experience with your friends! It's the quick and easy way to connect privately!
              </p>
            </div>

            <form className="right-side" onSubmit={handleSubmit}>
              <div className="input-field">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  placeholder='Enter Your Name'
                  value={name}
                  onInput={e => setName(e.target.value.trim())}
                  required
                  maxLength={"8"}
                />
              </div>
              <div className="input-field">
                <label htmlFor="name">Room ID</label>
                <input
                  type="text"
                  placeholder='Enter The Room ID'
                  value={roomid}
                  onInput={e => setRoomid(e.target.value.trim())}
                  required
                  maxLength={"6"}
                />
              </div>
              <div className="btn-field">
                <button type='submit'>Join The Room</button>
                <Link to={'/create_room'}>Create New Room</Link>
              </div>
              <div className="hm-btn">
                <Link to={'/'}>Go To Home</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Entry