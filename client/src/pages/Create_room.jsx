import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Create_room.css'
import { error, success, warning } from '../App';
import { useSocket } from '../components/SocketProvider';

const Create_room = () => {
    const [roomid, setRoomid] = useState('Generating...');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const { socket, connected } = useSocket();
    const [staus, setStaus] = useState(true);
    const navigate = useNavigate();

    const handleForm = (e) => {
        e.preventDefault();
        socket.emit('createRoom', { roomid, name });
    };

    const statusOfServer = () => {
        setTimeout(() => {
            if (!staus) {
                error('server is not connected.');
            }
        }, 3000);
    }


    useEffect(() => {
        if (!socket && !connected) {
            // navigate('/');
            setRoomid('Generating...');
            statusOfServer();
            return;
        }
        setStaus(!staus);
        socket.emit('get-id');
    }, [socket, connected])

    const handleCpy = () => {
        if (roomid === 'Generating...') {
            warning('Room ID is still being generating, please wait!')
        } else {
            if (navigator && navigator.clipboard) {
                navigator.clipboard.writeText(roomid)
                    .then(() => success('Room ID Copied!'))
                    .catch(() => error("Room ID wasn't copied."));
            } else {
                error('Clipboard API not supported on this browser.');
            }
        }
    }
    try {
        socket.on('serverData', (data) => {
            console.log(data.USERS, data.room_info, data.room_status, data.rooms);
        })
        socket.on('take-id', (data) => {
            setRoomid(data)
        })
    } catch (e) {
        console.error('Error receiving room ID:', e.message);
    }

    return (
        <>
            <div className="create-container">
                <div className="wrapper">
                    <div className="main-heading">
                        <h1>Create The Private Room</h1>
                    </div>
                    <div className="middle">

                        <div className="left-side">
                            <p className="description hide">
                                Ready to set up your own exclusive space? Create a new private room in just a few clicks! We generate a unique private code that you can share with friends, family, or colleagues.
                            </p>
                            <p className="description hide">
                                Once created, your private room is ready for your group to join, offering a secure and dedicated environment for your activities. It's simple, quick, and puts you in control.
                            </p>
                            <p className="description">
                                Create now and enjoy a fun-filled gaming experience with your friends! It's the quick and easy way to play privately!
                            </p>
                        </div>

                        <form className="right-side" onSubmit={handleForm}>
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
                                <label htmlFor="name">Your Email ID</label>
                                <input
                                    type="email"
                                    placeholder='Enter Your email ID'
                                    value={email}
                                    onInput={e => setEmail(e.target.value.trim())}
                                    required
                                />
                            </div>
                            <div className="input-field">
                                <label htmlFor="name">Your Room ID</label>
                                <input
                                    type="text"
                                    placeholder='Enter The Room ID'
                                    value={roomid}
                                    onInput={e => setRoomid(e.target.value)}
                                    readOnly
                                />
                                <div className="cpy-btn" onClick={handleCpy}>Copy</div>
                            </div>
                            <div className="btn-field">
                                <button type='submit'>Create The Room</button>
                                <Link to={'/join_room'}>Join Another Room</Link>
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

export default Create_room