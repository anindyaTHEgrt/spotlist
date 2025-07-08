const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { Server } = require('socket.io');
const WebSocket = require('ws');
const http = require('http');

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const app = express();

const server = http.createServer(app); // 🔁 Required for Socket.IO
// const io = new Server(server, { cors: { origin: '*' } });
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? [process.env.FRONTEND_URL]
            : '*'
    }
});

if(process.env.NODE_ENV !== 'production') {
    console.log("Running in development mode");
    app.use(cors());
} else {
    console.log("Running in production mode");
    app.use(cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    }));
}


const CredLoginRoutes = require('./routes/CredLoginRoutes.js');
const dbUserFunctionRoutes = require('./routes/dbUserFunctionsRoutes.js');
const PlaylistFunctionRoutes = require('./routes/PlaylistFunctionsRoutes.js');
const fetchUserRoute = require('./routes/fetchUserRoute.js');
const aiRoutes = require('./routes/aiRoutes.js');
const trackRoutes = require('./routes/trackRoutes.js');
const connectDB = require('./config/db.js');
const path = require("node:path");



app.use(express.json());
app.use("/api", CredLoginRoutes);
app.use("/db", dbUserFunctionRoutes);
app.use("/playlist", PlaylistFunctionRoutes);
app.use("/user", fetchUserRoute);
app.use("/intel", aiRoutes);
app.use("/track", trackRoutes);

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        python_ws_status: pySocket && pySocket.readyState === WebSocket.OPEN ? 'connected' : 'disconnected'
    });
});

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    })
}
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
// });


const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirect_uri = 'http://127.0.0.1:5174/callback';


connectDB();

// python websocket stuff
// const PYTHON_WS_URL = 'ws://localhost:8001/ws';
// let pySocket = new WebSocket(PYTHON_WS_URL);
//
// pySocket.on('open', () => {
//     console.log('✅ Connected to Python ML WebSocket');
// });
//
// pySocket.on('error', (err) => {
//     console.error('❌ Python WS Error:', err.message);
// });
//
// pySocket.on('close', () => {
//     console.warn('⚠️ Python WS disconnected. Attempting reconnect in 3s...');
//     setTimeout(() => {
//         pySocket = new WebSocket(PYTHON_WS_URL);
//     }, 3000);
// });
//
// pySocket.on('message', (data) => {
//     const prediction = JSON.parse(data);
//     io.emit('ml_response', prediction); // Broadcast to all frontends
// });

// Python WebSocket configuration
const PYTHON_WS_URL = process.env.PYTHON_WS_URL || 'ws://localhost:8001/ws';
let pySocket = null;

function connectToPython() {
    try {
        pySocket = new WebSocket(PYTHON_WS_URL);

        pySocket.on('open', () => {
            console.log('✅ Connected to Python ML WebSocket');
        });

        pySocket.on('error', (err) => {
            console.error('❌ Python WS Error:', err.message);
        });

        pySocket.on('close', () => {
            console.warn('⚠️ Python WS disconnected. Attempting reconnect in 5s...');
            setTimeout(connectToPython, 5000);
        });

        pySocket.on('message', (data) => {
            try {
                const prediction = JSON.parse(data);
                io.emit('ml_response', prediction);
            } catch (error) {
                console.error('Error parsing Python response:', error);
            }
        });
    } catch (error) {
        console.error('Failed to connect to Python WebSocket:', error);
        setTimeout(connectToPython, 5000);
    }
}

setTimeout(connectToPython, 10000);

// ---------- 🧠 Socket.IO for React Frontend ----------
// io.on('connection', (socket) => {
//     console.log(`📱 Frontend connected: ${socket.id}`);
//
//     socket.on('swipe_event', (swipeData) => {
//         console.log('📤 Swipe from frontend:', swipeData);
//         if (pySocket.readyState === WebSocket.OPEN) {
//             pySocket.send(JSON.stringify(swipeData));
//         } else {
//             console.warn("⚠️ Python WS not ready");
//         }
//     });
//
//     socket.on('disconnect', () => {
//         console.log(`❎ Frontend disconnected: ${socket.id}`);
//     });
// });

io.on('connection', (socket) => {
    console.log(`📱 Frontend connected: ${socket.id}`);

    socket.on('swipe_event', (swipeData) => {
        console.log('📤 Swipe from frontend:', swipeData);
        if (pySocket && pySocket.readyState === WebSocket.OPEN) {
            pySocket.send(JSON.stringify(swipeData));
        } else {
            console.warn("⚠️ Python WS not ready");
        }
    });

    socket.on('disconnect', () => {
        console.log(`❎ Frontend disconnected: ${socket.id}`);
    });
});

// server.listen(3001, () => {
//     console.log('🚀 Backend + Socket.IO running at http://localhost:3001');
// });

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend + Socket.IO running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

