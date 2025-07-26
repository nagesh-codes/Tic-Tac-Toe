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
    // console.log('user is connected');
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
                game_staus: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                players: {
                    [socket_ID]: [0, 0],
                },
                draw: 0,
                full: false
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
                ROOMS[data.roomid]['users'][ID] = [0, 0];
                const pl1_id = USERS[Object.keys(ROOMS[data.roomid].players)[0]];
                ROOMS[data.roomid].isFull = true;
                io.to(pl1_id).emit('partnerJoined');
                io.to(ID).emit('RoomJoin');
            }
        } catch (e) {
            console.error(e);
            io.to(ID).emit('serverErr');
        }
    });
});

server.listen(port, '0.0.0.0', () => { console.log(`server started on http://localhost:${port}`) });