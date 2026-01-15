const  emitToUser  =  require("../utils/rooms.js");

module.exports = function handlePmEvent(io, data) {
    emitToUser(io, data.userId, "pm", data);
}
