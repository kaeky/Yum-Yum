import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketIo = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000', {
      transports: ['websocket'],
      autoConnect: true,
    });

    socketIo.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socketIo.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return { socket, isConnected };
}
