const { Server } = require("socket.io");

let io;
const connectedUsers = new Map();

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PATCH"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`Socket Connected: ${socket.id}`);

        // Register user after connection
        socket.on("register", (user) => {
            connectedUsers.set(user.id, {
                socketId: socket.id,
                role: user.role,
            });

            console.log(`${user.role} connected: ${socket.id}`);
        });

        // Remove user on disconnect
        socket.on("disconnect", () => {
            for (const [userId, value] of connectedUsers.entries()) {
                if (value.socketId === socket.id) {
                    connectedUsers.delete(userId);
                    break;
                }
            }

            console.log(`Socket Disconnected: ${socket.id}`);
        });
    });
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized");
    }
    return io;
};

module.exports = {
    initializeSocket,
    getIO,
    connectedUsers,
};