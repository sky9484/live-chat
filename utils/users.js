const users = [];

// user join the chat
function userJoin(id, username, room) {
   
    const user = {id, username, room};

    users.push(user);

    return user;

}

// Get current user identity

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// when user leave chat

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0]; // [0]  instead of returning entire array. i just need it to return ne username
    }
}

// room users [ GET /users]

function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = { 
    userJoin, 
    getCurrentUser,
    userLeave,
    getRoomUsers 
}; 