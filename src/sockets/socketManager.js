let io = null;


// Initialize Socket
const initSocket = (socketServer) => {

    io = socketServer;

};


// Get Socket Instance
const getIO = () => {

    if (!io) {

        throw new Error("Socket.io not initialized");

    }

    return io;

};


module.exports = {
    initSocket,
    getIO
};