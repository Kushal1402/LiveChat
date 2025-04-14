import { io } from 'socket.io-client'

const local_url = 'http://localhost:9005'
const versal_url = 'https://vibe-chats-backend.vercel.app'

// Replace with your backend socket server URL
const socket = io(import.meta.env.VITE_API_BASE_URL, {
    transports: ['websocket'], // optional but helps in some setups
    withCredentials: true, // if you're using cookies/auth
})
export default socket