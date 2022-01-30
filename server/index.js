const express = require("express");
const http = require("http");
const app = express();

const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

const PORT = 4001 || process.env.PORT;

const socketio = require("socket.io");

const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000", //may need to change when deploying
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    //emits to the user
    socket.emit("message", "welcome");

    //emits to everyone but the person connecting
    socket.broadcast.emit("message", "a user has connected");

    //emits to everyone

    socket.on("sendMessage", (message) => {
        io.emit("chatMessage", message);
    });

    socket.on("disconnect", () => {
        io.emit("message", "a user has left the chat");
    });
});

server.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});
