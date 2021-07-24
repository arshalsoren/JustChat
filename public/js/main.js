const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

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

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">Brad <span>9:12pm</span></p>
        <p class="text">
            ${message}
        </p>
        `;
    document.querySelector('.chat-messages').appendChild(div);
}