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
    socket.on("joinRoom", ({ room }) => {
        console.log("Joining room");
        socket.join(room);

        socket.on("sendMessage", (message) => {
            io.emit("chatMessage", message);
        });
        socket.on("leaveRoom", ({ room }) => {
            console.log("Leaving room");
            socket.leave(room);
        });
        socket.on("disconnect", () => {
            console.log("disconnected");
            socket.leave(room);
        });
    });

    //emits to everyone but the person connecting
    // socket.broadcast.emit("chatMessage", "a user has connected");
});

server.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});
