const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'administrator';

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// When client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // 1. Message only for the client
        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to JustChat!'));

        // 2. Brodcast message for everyone except the new client
        // When a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, `${user.username} has joined the chat`)
            );
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msgText) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room)
            .emit(
                'message',
                formatMessage(user.username, msgText)
            );
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {

            // 3. Message for every client
            io.to(user.room)
                .emit(
                    'message',
                    formatMessage(botName, `${user.username} has left the chat`)
                );
        }
    });
});

// Server Route
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
})