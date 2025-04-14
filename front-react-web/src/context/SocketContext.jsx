// context/SocketContext.js
import { createContext, useContext } from 'react';

// Create socket context
const SocketContext = createContext(null);

// Custom hook for consuming the socket context
export const useSocketContext = () => useContext(SocketContext);

// Provider component
export const SocketProvider = ({ children, socket }) => {

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
