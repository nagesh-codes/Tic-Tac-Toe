import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import { generateRoomId } from './dataAndFunctions.js'

dotenv.config()
const frontend_url = process.env.FRONTEND_URL
const app = express();
app.use(cors())
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [frontend_url,"http://localhost:3000"],
        methods: ["GET", "POST"]
    }
})
const port = 5555;
console.log(generateRoomId());

io.on('connection', (socket) => {
    console.log('user is connected');
    socket.on('get-id', () => {
        const id = generateRoomId();
        io.to(socket.id).emit('take-id', (id));
    })
})

server.listen(port, () => { console.log(`server started on http://localhost:${port}`) });