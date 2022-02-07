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
    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log("Joining room");
        //send message to everyone in joined room
        socket.on("sendMessage", (message) => {
            io.in(room).emit("chatMessage", message);
        });

        socket.on("playSong", (song) => {
            io.in(room).emit("playSong", song);
        });

        socket.on("pauseSong", (pause) => {
            io.in(room).emit("pauseSong", pause);
        });

        socket.on("disconnect", () => {
            socket.leave(room);
        });
    });

    //emits to everyone but the person connecting
    // socket.broadcast.emit("chatMessage", "a user has connected");
});

server.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});
