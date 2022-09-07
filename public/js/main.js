const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// get username , room from URL

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// socket connection
const socket = io();

//Join chat 
socket.emit('joinRoom', { username, room });

// To get room and users
socket.on('roomUsers', ({ room, users }) => {
    // use some DOM methods here to handle
    outputRoomName(room);
    outputUser(users);

}); 
   

// welcome message from socket.emit/server
socket.on('message', message => {
    console.log(message);
    // we output the message using vanilla javascript.
    outputMessage(message);

    // scroll down when go  new message. priority the new one.
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// chat form functions.
// message when submit

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
           // get text message
    const msg = e.target.elements.msg.value;
     // dia emit message to server
    socket.emit('chatMessage', msg);
    // delete input after submit
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


// output message to DOM

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
                     <p class="text">
                     ${message.text}
                     </p>`;
    
    document.querySelector('.chat-messages').appendChild(div);
}

    
// add room name to DOM // sidebar information

function outputRoomName(room) {
   roomName.innerText = room;
}
    
// add user , name to DOM
// simples way to get user list, since its an array too many information
// can use this method , since i didn't use database to store user information and register login methods
/// in order for this method to work. do not forget the .join(''), because it is an array.
function outputUser(users) {
    
    userList.innerHTML = `                           
       ${users.map(user => `<li>${user.username}</li>`).join('')}  
    `;
}
