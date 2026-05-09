require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const { initSocket } = require("./src/sockets/socketManager");

const app = require("./src/app");

const { testConnection } = require("./src/config/db");

const PORT = process.env.PORT || 5000;


// Create HTTP Server
const server = http.createServer(app);


// Socket Server
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// Initialize Socket Manager
initSocket(io);


// Socket Connection
io.on("connection", (socket) => {

    console.log("New Socket Connected:", socket.id);

    
    socket.on("disconnect", () => {
        console.log("Socket Disconnected:", socket.id);
    });

});

// Test Database Connection
testConnection();

// Start Server
server.listen(PORT, () => {
    console.log(`LIMN CORE SERVER RUNNING ON PORT ${PORT}`);
});