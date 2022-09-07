const path = require('path');
const http = require('http'); 
const express = require('express');
const { createServer } = require('tls');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');


const app = express();
// create server to access routes
const server = http.createServer(app);
// realtime server for live session.
const io = socketio(server);

// create a static file to access frontend
app.use(express.static(path.join(__dirname, 'public'))); 

// bot
const botName = 'HF()x';

// Run when client connect . when reload server, it always returns console.
io.on('connection', socket => {
    // join chat room url 
    socket.on('joinRoom', ({ username, room}) => {
    
    const user = userJoin(socket.id, username, room);
    
    socket.join(user.room);

    // when client connect
    socket.emit('message', formatMessage(botName, 'Welcome onboard Warriors!'));

    // Broadcast to other clients when other clients connect // except client that is already connected
    socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined`));

    // User and Room information here when join, sidebar information
    
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    });


    });

    // listen fo chat. emit to everybody
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        // this will appear the sender name and only in the room specified
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // when client disconnect
    socket.on('disconnect', () => {

       const user = userLeave(socket.id);

       if(user) {

          io.to(user.room).emit('message', formatMessage(botName, `${user.username} has disconnected`));
        
         // User and Room information here when left the chat, sidebar information

         io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

       }
     
    });

});
// create a port
const PORT = 3002 || process.env.PORT;

server.listen(PORT, () => console.log(`server is running at ${PORT}`));