// hooks/useSocket.js
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

export default function useSocket(token) {

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {      
      const newSocket = io(import.meta.env.VITE_WS_BASE_URL, {
        auth: { token },
        transports: ['websocket'],
        withCredentials: true
      });

      setSocket(newSocket);

      // Connection successful
      newSocket.on("connect", () => {
        console.log("✅ Connected to socket server:", newSocket.id);
      });

      return () => {
        newSocket.disconnect();
      };
    } else {
      setSocket(null);
    }
  }, [token]);

  return socket;
}
