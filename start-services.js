const { spawn } = require('child_process');
const path = require('path');

// Start Node.js backend
const backend = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit'
});

// Start Python WebSocket server (located in python/python_backend directory)
const python = spawn('python', ['ml_ws_server.py'], {
    cwd: path.join(__dirname, 'python', 'py_backend'),
    stdio: 'inherit'
});

// Handle process cleanup
process.on('SIGINT', () => {
    console.log('\nShutting down services...');
    backend.kill('SIGTERM');
    python.kill('SIGTERM');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down services...');
    backend.kill('SIGTERM');
    python.kill('SIGTERM');
    process.exit(0);
});

console.log('Starting Node.js backend and Python WebSocket server...');