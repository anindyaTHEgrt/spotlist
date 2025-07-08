import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (onMLResponse) => {
    const socketRef = useRef();
    const callbackRef = useRef(onMLResponse);

    // Update ref on every render
    useEffect(() => {
        callbackRef.current = onMLResponse;
    }, [onMLResponse]);

    useEffect(() => {

        // Use production URL or development URL
        const socketURL = import.meta.env.MODE === 'development'
            ? "http://localhost:3001"
            : window.location.origin;


        socketRef.current = io(socketURL);

        socketRef.current.on("connect", () => {
            console.log("✅ Connected to backend socket");
        });

        // Call the latest callbackRef, not a possibly stale function
        socketRef.current.on("ml_response", (data) => {
            console.log("📥 Received ml_response:", data);
            callbackRef.current?.(data);
        });

        socketRef.current.on("disconnect", () => {
            console.log("❌ Disconnected from backend socket");
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    return socketRef;
};

export default useSocket;
