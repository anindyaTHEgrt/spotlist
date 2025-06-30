import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (onMLResponse) => {
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io("http://localhost:3001");

        socketRef.current.on("connect", () => {
            console.log("Connected to backend socket");
        });

        socketRef.current.on("ml_response", onMLResponse);

        return () => {
            socketRef.current.disconnect();
        };
    }, [onMLResponse]);

    return socketRef;
};

export default useSocket;
