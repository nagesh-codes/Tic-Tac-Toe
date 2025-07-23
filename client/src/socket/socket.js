import { io } from 'socket.io-client'
import dotenv from 'dotenv'

dotenv.config()
const url = process.env.BACKEND_URL
export const socket = io(url)