import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Create_room.css'

const Create_room = () => {
    const [roomid, setRoomid] = useState('Generating...');
    const [name, setName] = useState('')
    return (
        <>
            <div className="create-container">
                <div className="wrapper">
                    <div className="main-heading">
                        <h1>Create The Private Room</h1>
                    </div>
                    <div className="middle">

                        <div className="left-side">
                            <p className="description">
                                Ready to set up your own exclusive space? Create a new private room in just a few clicks! We generate a unique private code that you can share with friends, family, or colleagues.
                            </p>
                            <p className="description hide">
                                Once created, your private room is ready for your group to join, offering a secure and dedicated environment for your activities. It's simple, quick, and puts you in control.
                            </p>
                            <p className="description">
                                Create now and enjoy a fun-filled gaming experience with your friends! It's the quick and easy way to play privately!
                            </p>
                        </div>

                        <form className="right-side">
                            <div className="input-field">
                                <label htmlFor="name">Your Name</label>
                                <input
                                    type="text"
                                    placeholder='Enter Your Name'
                                    value={name}
                                    onInput={e => setName(e.target.value)}
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
                                    required
                                />
                                <div className="cpy-btn">Copy</div>
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