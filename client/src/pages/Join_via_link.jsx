import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { error, success, warning } from "../App";
import { useSocket } from "../components/SocketProvider";
import './Join_via_link.css'

const Join_via_link = () => {
    const { id } = useParams();
    const [roomid, setRoomId] = useState(id || null);
    const [name, setName] = useState('');
    const [creator, setCreator] = useState('Your Friend');
    const { socket, connected } = useSocket();
    const navigate = useNavigate();

    const handleClick = () => {
        socket.emit('joinRoom', { name, roomid });
    }

    useEffect(() => {
        if (!roomid) {
            error("Sorry, that link is not working now :(");
            navigate("/");
            return;
        }
        if (!socket) { return };

        sessionStorage.setItem("room", roomid);
        socket.on("noRoom", () => {
            error("That room is not available :(");
            navigate("/");
        });

        socket.on('not', () => {
            error("That room is not available :(");
            navigate("/");
        })

        socket.on("creator", (name) => {
            setCreator(name);
        });

        socket.on('roomNotAvailabel', () => {
            error("That room is not available :(");
            navigate("/");
        });

        socket.on('changeName', () => {
            warning('This Name Is Already Taken By Room Creator, Please Choose Another Name');
        });

        socket.on('RoomJoin', () => {
            socket.emit('takeInfo', { roomid });
        });

        socket.on('getInfo', (data) => {
            sessionStorage.setItem('player', data.pl2);
            sessionStorage.setItem('room', roomid);
            success('Successfully Joined The Room');
            navigate(`/game_home/${roomid}`);
        })

        return () => {
            socket.off("noRoom");
            socket.off("creator");
            socket.off('roomNotAvailabel');
            socket.off('changeName');
            socket.off('getInfo');
            socket.off('RoomJoin');
        };
    }, [socket, roomid]);

    useEffect(() => {
        if (socket && roomid) {
            socket.emit("getCreatorName", roomid);
        }
    }, [socket, connected, roomid]);

    return (
        <>
            <div className="link-container">
                <div className="wrapper">
                    <div className="main-heading">WelCome To <span>Tic-Tac-Toe</span> Game</div>
                    <div className="info">You Are Invited By {creator}.</div>
                    <div className="info">(Just Enter Your Name And Click on Join btn You Are Auatomaticaly Joined To Your Friend.)</div>
                    <div className="input-area">
                        <input
                            type="text"
                            value={name}
                            placeholder="Enter Your Name"
                            onInput={e => setName(e.target.value)}
                        />
                        <button className="all" onClick={handleClick}>Join</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Join_via_link;
