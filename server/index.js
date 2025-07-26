import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import { generateRoomId, ROOMS, USERS } from './dataAndFunctions.js'

dotenv.config()
const frontend_url = process.env.FRONTEND_URL
console.log(frontend_url)
const app = express();
app.use(cors({
    origin: [frontend_url],
    methods: ["GET", "POST"],
    credentials: true
}))
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [frontend_url],
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
            USERS[socket_ID] = {
                name: data.name,
                roomID: data.roomid,
                email: data.email
            };
            ROOMS[data.roomid] = {
                unique_id: data.roomid.split("").reverse().join(''),
                createdAt: Date.now(),
                createBy: socket_ID,
                game_staus: [2, 0, 2, 0, 0, 1, 0, 2, 0],
                players: {
                    [socket_ID]: [1, 2],
                },
                draw: 0,
                isFull: false,
                turn: Math.floor(Math.random() * 2)
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
                && (!ROOMS[data.roomid].isFull)) {
                io.to(ID).emit('roomNotAvailabel');
            } else if (USERS[Object.keys(ROOMS[data.roomid].players)[0]]?.name === data.name) {
                io.to(ID).emit('changeName');
            } else {
                USERS[ID] = {
                    name: data.name,
                    roomID: data.roomid,
                };
                ROOMS[data.roomid]['players'][ID] = [5, 6];
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
        const roomid = data.roomid;
        const ID = socket.id;
        try {
            const pl1 = USERS[Object.keys(ROOMS[roomid].players)[0]]?.name;
            const pl2 = USERS[Object.keys(ROOMS[roomid].players)[1]]?.name;
            const pl1_sta = Object.values(ROOMS[roomid].players)[0];
            const pl2_sta = Object.values(ROOMS[roomid].players)[1];
            const createdBy = USERS[ROOMS[roomid].createdBy].name;
            const dt = {
                roomid: roomid,
                game_status: ROOMS[roomid].game_staus,
                draw: ROOMS[roomid].draw,
                turn: ROOMS[roomid].turn,
                pl1,
                pl2,
                pl1_sta,
                pl2_sta,
                createdBy
            };
            io.to(ID).emit('getInfo', dt);
        } catch (e) {
            console.error(e);
            io.to(ID).emit('serverErr');
        }
    });
});

server.listen(port, '0.0.0.0', () => { console.log(`server started on http://localhost:${port}`) });