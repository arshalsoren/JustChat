const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// When client connects
io.on('connection', socket => {
    // 1. Message only for the client
    // Welcome current user
    socket.emit('message', 'Welcome to JustChat!');

    // 2. Brodcast message for everyone except the new client
    // When a user connects
    socket.broadcast.emit('message', 'User has joined the chat');

    // When a user disconnects
    socket.on('disonnect', () => {
        // 3. Message for every client
        io.emit('message', 'User has left the chat');
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msgText) => {
        io.emit('message', msgText);
    })
});

// Server Route
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
})