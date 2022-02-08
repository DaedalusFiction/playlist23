const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const moment = require("moment");

const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

const PORT = process.env.PORT || 4001;

const socketio = require("socket.io");

const io = socketio(server, {
    cors: {
        // origin: "playlist23.herokuapp.com/",
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

app.use(express.static(path.resolve(__dirname, "client/build")));

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

io.on("connection", (socket) => {
    socket.on("joinRoom", (room) => {
        socket.join(room);
        socket.broadcast.emit("chatMessage", {
            time: moment().format("h:mm a"),
            key: Date.now(),
            room: room,
            user: "playlist: 23",
            message: `a user has joined the chat`,
        });
        //send message to everyone in joined room
        socket.on("sendMessage", (message) => {
            io.in(room).emit("chatMessage", message);
        });

        socket.on("playSong", (song) => {
            io.in(room).emit("playSong", song);
        });
        socket.on("addSong", (song) => {
            io.in(room).emit("addSong", song);
        });

        socket.on("pauseSong", (pause) => {
            io.in(room).emit("pauseSong", pause);
        });

        socket.on("disconnect", () => {
            socket.broadcast.emit("chatMessage", {
                time: moment().format("h:mm a"),
                key: Date.now(),
                room: room,
                user: "playlist: 23",
                message: `a user has left the chat`,
            });
            socket.leave(room);
        });
    });
});

server.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});
