// SocketProvider.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext({ socket: null, connected: false });
const url = import.meta.env.VITE_BACKEND_URL;

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!url) return;

    const s = io(url);

    s.on('connect', () => {
      setSocket(s);
      setConnected(true);
    });

    s.on('disconnect', () => {
      setConnected(false);
      setSocket(null);
    });

    return () => s.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
