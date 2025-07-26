import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import { generateRoomId } from './dataAndFunctions.js'

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
        io.to(socket.id).emit('take-id', (id));
    });

    socket.on('createRoom', (data) => {
    })
})
server.listen(port, '0.0.0.0', () => { console.log(`server started on http://localhost:${port}`) });