const { userLeave } = require("../../utils/users");

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomNane = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true // ignores special characters in the url 
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);

    // Scroll down to new message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Form Submission
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msgText = e.target.elements.msg.value;

    // Emit Message to server
    socket.emit('chatMessage', msgText);

    // Clear input after message is sent
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output Message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>
        `;
    document.querySelector('.chat-messages').appendChild(div);
}

// Output RoomName to DOM
function outputRoomName(room) {
    roomNane.innerText = room;
}

// Output Users to DOM
function outputUsers(users) {
    userList.innerHTML=`
        ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}