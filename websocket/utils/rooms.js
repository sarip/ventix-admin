function joinUserRoom(socket, userId) {
    socket.join(`user:${userId}`);
}

function joinRoom(socket, roomName) {
    socket.join(roomName);
}

function emitToUser(io, userId, event, payload) {
    io.to(`user:${userId}`).emit(event, payload);
}

function emitToRoom(io, roomName, event, payload) {
    io.to(roomName).emit(event, payload);
}

module.exports = { joinUserRoom, joinRoom, emitToUser, emitToRoom };