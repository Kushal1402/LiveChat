  // context/SocketContext.js
  import useSocket from '@/hooks/useSocket';
  import { createContext, useContext, useEffect, useRef, useState } from 'react';

  // Create socket context
  const SocketContext = createContext(null);

  // Custom hook for consuming the socket context
  export const useSocketContext = () => useContext(SocketContext);

  // Provider component
  export const SocketProvider = ({ token, children }) => {

    const socket = useSocket(token);
    const socketRef = useRef(null);
    const listenersRef = useRef(new Map())
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
      if (!socket) return;

      socketRef.current = socket;

      const handleConnect = () => {
        console.log("✅ Socket connected:", socket.id);
        setIsConnected(true);

        // Re-attach all existing listeners
        listenersRef.current.forEach((handler, event) => {
          socket.on(event, handler);
        });
      };

      const handleDisconnect = () => {
        console.log("❌ Socket disconnected");
        setIsConnected(false);
      };

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.disconnect();
        socketRef.current = null;
        listenersRef.current.clear();
      };
    }, [socket]);


    const addListener = (event, handler) => {
      listenersRef.current.set(event, handler);
      if (socketRef.current) {
        socketRef.current?.on(event, handler);
      }
      console.log(`📥 Listener added: ${event}`);
    };

    // Remove event listener
    const removeListener = (event) => {
      const handler = listenersRef.current.get(event);
      if (!handler) return;

      if (socketRef.current) {
        socketRef.current?.off(event, handler);
      }
      listenersRef.current.delete(event);
      console.log(`🗑️ Listener removed: ${event}`);
    };


    return (
      <SocketContext.Provider value={{
        socket: socketRef.current,
        isConnected,
        addListener,
        removeListener
      }}>
        {children}
      </SocketContext.Provider>
    );
  };

  export default SocketContext;
