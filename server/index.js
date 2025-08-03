import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import { addPlayer, checkWin, generateRoomId, roomDeletion, ROOMS, USERS } from './dataAndFunctions.js'

dotenv.config();
const frontend_url = process.env.FRONTEND_URL;
const app = express();
app.use(cors({
    origin: [frontend_url],
    methods: ["GET", "POST"],
    credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [frontend_url],
        methods: ["GET", "POST"],
        credentials: true
    }
})
const port = process.env.PORT || 3400;

app.get('/ping', (req, res) => {
    res.send({ staus: 'online' });
})

io.on('connection', (socket) => {
    roomDeletion();

    socket.on('get-id', () => {
        const id = generateRoomId();
        io.to(socket.id).emit('take-id', id);
    });

    socket.on('createRoom', (data) => {
        const socket_ID = socket.id;
        try {
            const sign = Math.floor(Math.random() * 2) === 0 ? 'X' : 'O';
            USERS[socket_ID] = {
                name: data.name,
                roomid: data.roomid,
                email: data.email,
                game_stat: 3
            };
            ROOMS[data.roomid] = {
                unique_id: data.roomid.split("").reverse().join(''),
                createdAt: Date.now(),
                createBy: socket_ID,
                game_status: ['', '', '', '', '', '', '', '', '', ''],
                players: {
                    [socket_ID]: [0, 0, sign],
                },
                draw: 0,
                isFull: false,
                turn: Math.floor(Math.random() * 2),
                isDisabled: false,
                isMatchStart: false,
            }
            io.to(socket_ID).emit('roomCreated');
        } catch (e) {
            console.log(e.message)
            io.to(socket_ID).emit('serverErr');
        }
    });

    socket.on('joinRoom', (data) => {
        const ID = socket.id;
        try {
            if ((!(Object.keys(ROOMS).some(rm => rm == data.roomid)))
                || (ROOMS[data.roomid].isFull)) {
                io.to(ID).emit('roomNotAvailabel');
            } else if (USERS[Object.keys(ROOMS[data.roomid].players)[0]]?.name === data.name) {
                io.to(ID).emit('changeName');
            } else {
                const firstPlayer = Object.values(ROOMS[data.roomid].players)[0];
                const firstPlayerSign = firstPlayer[2];
                USERS[ID] = {
                    name: data.name,
                    email: null,
                    roomid: data.roomid,
                    game_stat: 3
                };
                if (firstPlayerSign === 'X') {
                    ROOMS[data.roomid]['players'][ID] = [0, 0, 'O'];
                } else {
                    ROOMS[data.roomid]['players'][ID] = [0, 0, 'X'];
                }
                const pl1_id = Object.keys(ROOMS[data.roomid].players)[0];
                ROOMS[data.roomid].isFull = true;
                ROOMS[data.roomid].isMatchStart = true;
                io.to(pl1_id).emit('partnerJoined');
                io.to(ID).emit('RoomJoin');
            }
        } catch (e) {
            console.error(e.message);
            io.to(ID).emit('serverErr');
        }
    });

    socket.on('takeInfo', (data) => {
        try {
            if (!ROOMS[data.roomid]) {
                io.to(socket.id).emit('goToHome');
                return;
            }
            if (ROOMS[data.roomid].isMatchStart) {
                const roomid = data.roomid;
                const ID = socket.id;
                const ret_id = addPlayer(data, ID);
                const pl1 = USERS[Object.keys(ROOMS[roomid].players)[0]]?.name;
                const pl2 = USERS[Object.keys(ROOMS[roomid].players)[1]]?.name;
                const pl1_sta = Object.values(ROOMS[roomid].players)[0];
                const pl2_sta = Object.values(ROOMS[roomid].players)[1];
                const dt = {
                    roomid: roomid,
                    game_status: ROOMS[roomid].game_status,
                    draw: ROOMS[roomid].draw,
                    turn: ROOMS[roomid].turn,
                    pl1,
                    pl2,
                    pl1_sta,
                    pl2_sta,
                    isDisabled: ROOMS[roomid].isDisabled,
                    isMatchStart: ROOMS[roomid].isMatchStart,
                };
                io.to(ret_id).emit('partnerJoined');
                io.to(ID).emit('getInfo', dt);
                if (USERS[ID].game_stat === 1) {
                    io.to(ID).emit('youWin');
                } else if (USERS[ID].game_stat === 0) {
                    io.to(ID).emit('youLoose');
                } else if (USERS[ID].game_stat === 2) {
                    io.to(ID).emit('gameDraw');
                }
            } else {
                io.to(socket.id).emit('getInfo', { isMatchStart: ROOMS[data.roomid].isMatchStart });
            }
        } catch (e) {
            console.error(e.message);
            io.to(socket.id).emit('serverErr');
        }
    });

    socket.on('cellClick', (data) => {
        try {
            const room = ROOMS[data.roomid];
            if (!room) return;
            room.game_status = data.arr;
            room.turn = room.turn === 0 ? 1 : 0;
            const [id1, id2] = Object.keys(room.players);
            const [sta1, sta2] = [room.players[id1], room.players[id2]];
            const pl1 = USERS[id1]?.name;
            const pl2 = USERS[id2]?.name;
            const win = checkWin(data.arr);
            const isDraw = win ? false : data.arr.filter(cell => cell === '').length === 0;
            if (win) {
                if (pl1 === data.player) {
                    room.players[id1] = [sta1[0] + 1, sta1[1], sta1[2]];
                    room.players[id2] = [sta2[0], sta2[1] + 1, sta2[2]];
                } else {
                    room.players[id2] = [sta2[0] + 1, sta2[1], sta2[2]];
                    room.players[id1] = [sta1[0], sta1[1] + 1, sta1[2]];
                }
                room.turn = Math.floor(Math.random() * 2);
                room.isDisabled = true;
                Object.keys(room.players).forEach((id) => {
                    if (id == socket.id) {
                        USERS[id].game_stat = 1;
                    } else {
                        USERS[id].game_stat = 0;
                    }
                })
            }
            console.log(isDraw);
            if (isDraw) {
                room.draw += 1;
                Object.keys(room.players).forEach((id) => {
                    USERS[id].game_stat = 2;
                });
                room.isDisabled = true;
            }
            const dt = {
                roomid: data.roomid,
                game_status: room.game_status,
                draw: room.draw,
                turn: room.turn,
                pl1,
                pl2,
                pl1_sta: room.players[id1],
                pl2_sta: room.players[id2],
                isDisabled: room.isDisabled,
            };
            Object.keys(room.players).forEach((id) => {
                io.to(id).emit('newGameState', dt);
                if (win && id === socket.id) {
                    io.to(id).emit('youWin');
                } else if (win && id !== socket.id) {
                    io.to(id).emit('youLoose');
                } else if (USERS[id].game_stat == 2) {
                    io.to(id).emit('gameDraw');
                }
            });
        } catch (error) {
            console.error('Error handling cellClick:', error.message);
        }
    });

    socket.on('resetGame', (data) => {
        try {
            const room = ROOMS[data.roomid];
            if (!room) return;
            room.game_status = ['', '', '', '', '', '', '', '', ''];
            room.isDisabled = false;
            if (data.restart) {
                room.players = {
                    [Object.keys(room.players)[0]]: [0, 0, room.players[Object.keys(room.players)[0]][2]],
                    [Object.keys(room.players)[1]]: [0, 0, room.players[Object.keys(room.players)[1]][2]]
                };
                room.draw = 0;
            }
            const pl1_id = Object.keys(room.players)[0];
            const pl2_id = Object.keys(room.players)[1];
            const pl1 = USERS[pl1_id]?.name;
            const pl2 = USERS[pl2_id]?.name;
            const dt = {
                roomid: data.roomid,
                game_status: room.game_status,
                draw: room.draw,
                turn: room.turn,
                pl1,
                pl2,
                pl1_sta: room.players[pl1_id],
                pl2_sta: room.players[pl2_id],
                isDisabled: room.isDisabled,
            };
            Object.keys(room.players).forEach((id) => {
                USERS[id].game_stat = 3;
            });
            Object.keys(room.players).forEach((id) => {
                io.to(id).emit('resetedGame', dt);
            });
        } catch (error) {
            console.error('Error handling resetGame:', error.message);
        }
    });

    socket.on('leaveRoom', (data) => {
        try {
            const roomid = data.roomid;
            if (!ROOMS[roomid]) return;
            const players = ROOMS[roomid].players;
            if (Object.keys(players).length === 1) {
                delete ROOMS[roomid];
                io.to(Object.keys(players)[0]).emit('goToHome');
                return;
            }
            const playerId = socket.id;
            delete USERS[playerId];
            delete players[playerId];
            if (Object.keys(players).length === 0) {
                delete ROOMS[roomid];
                return;
            }
            const remainingPlayerId = Object.keys(players)[0];
            const remainingPlayerName = USERS[remainingPlayerId]?.name;
            io.to(remainingPlayerId).emit('partnerLeft', remainingPlayerName);
        } catch (error) {
            console.error('Error handling leaveRoom:', error.message);
        }
    })

    socket.on('disconnecting', () => {
        try {
            const roomid = USERS[socket.id].roomid;
            if (!roomid) {
                return;
            }
            Object.keys(ROOMS[roomid].players).forEach((id) => {
                io.to(id).emit('discnn');
            });
        } catch (error) {
            console.error(error.message);
        }
    })

});

server.listen(port, '0.0.0.0', () => { console.log(`server started on port:${port}`) });