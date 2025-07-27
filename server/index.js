import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import { addPlayer, checkWin, generateRoomId, ROOMS, USERS } from './dataAndFunctions.js'

dotenv.config();
const frontend_url = process.env.FRONTEND_URL;
const frontend_url_2 = process.env.FRONTEND_URL_2;
const app = express();
app.use(cors({
    origin: [frontend_url, frontend_url_2],
    methods: ["GET", "POST"],
    credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [frontend_url, frontend_url_2],
        methods: ["GET", "POST"],
        credentials: true
    }
})
const port = 5555;

io.on('connection', (socket) => {

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
                email: data.email
            };
            ROOMS[data.roomid] = {
                unique_id: data.roomid.split("").reverse().join(''),
                createdAt: Date.now(),
                createBy: socket_ID,
                game_status: ['', '', '', 'X', 'O', 'X', 'O', '', 'O', 'O'],
                players: {
                    [socket_ID]: [1, 2, sign],
                },
                draw: 0,
                isFull: false,
                turn: Math.floor(Math.random() * 2),
                isDisabled: false
            }
            const unique = data.roomid.split("").reverse().join('');
            io.to(socket_ID).emit('roomCreated', unique);
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
                };
                if (firstPlayerSign === 'X') {
                    ROOMS[data.roomid]['players'][ID] = [5, 6, 'O'];
                } else {
                    ROOMS[data.roomid]['players'][ID] = [5, 6, 'X'];
                }
                const pl1_id = Object.keys(ROOMS[data.roomid].players)[0];
                ROOMS[data.roomid].isFull = true;
                io.to(pl1_id).emit('partnerJoined');
                io.to(ID).emit('RoomJoin');
            }
        } catch (e) {
            console.error(e);
            io.to(ID).emit('serverErr');
        }
    });

    socket.on('takeInfo', (data) => {
        try {
            if (!ROOMS[data.roomid]) {
                io.to(socket.id).emit('goToHome');
                return;
            }
            const roomid = data.roomid;
            const ID = socket.id;
            addPlayer(data, ID);
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
                pl2_sta
            };
            io.to(ID).emit('getInfo', dt);
        } catch (e) {
            console.error(e);
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
            if (win) {
                if (pl1 === data.player) {
                    room.players[id1] = [sta1[0] + 1, sta1[1], sta1[2]];
                    room.players[id2] = [sta2[0], sta2[1] + 1, sta2[2]];
                } else {
                    room.players[id2] = [sta2[0] + 1, sta2[1], sta2[2]];
                    room.players[id1] = [sta1[0], sta1[1] + 1, sta1[2]];
                }
                io.to(socket.id).emit('youWin');
                Object.keys(room.players).forEach((id) => {
                    if (socket.id !== id)
                        io.to(id).emit('youLoose');
                });
                // room.game_status = ['', '', '', '', '', '', '', '', ''];
                room.turn = Math.floor(Math.random() * 2);
                room.isDisabled = true;
            } else if (!data.arr.includes('')) {
                room.draw += 1;
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
                isDisabled: room.isDisabled
            };
            Object.keys(room.players).forEach((id) => {
                io.to(id).emit('newGameState', dt);
                if (win && id === socket.id) {
                    io.to(id).emit('youWin');
                } else if (win && id !== socket.id) {
                    io.to(id).emit('youLoose');
                }
            });
        } catch (error) {
            console.error('Error handling cellClick:', error);
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
                isDisabled: room.isDisabled
            };
            Object.keys(room.players).forEach((id) => {
                io.to(id).emit('resetedGame', dt);
            });
        } catch (error) {
            console.error('Error handling resetGame:', error);
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

server.listen(port, '0.0.0.0', () => { console.log(`server started on http://localhost:${port}`) });