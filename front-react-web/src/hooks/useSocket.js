// hooks/useSocket.js
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function useSocket(token) {

  const [socket, setSocket] = useState(null);

  useEffect(() => {

    if (!token) {
      setSocket(null)
      return  
    }

    if (token) {
      const newSocket = io(import.meta.env.VITE_WS_BASE_URL, {
        auth: { token },
        transports: ['websocket'],
        withCredentials: true
      });
      setSocket(newSocket);    
      return () => {
        newSocket.disconnect();
      };
    } else {
      setSocket(null);
    }
  }, [token]);

  return socket;
}
