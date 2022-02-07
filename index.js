const express = require("express");
const http = require("http");
const app = express();
const path = require("path");

const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

const PORT = process.env.PORT || 4001;

const socketio = require("socket.io");

const io = socketio(server, {
    cors: {
        origin: "https://playlist23.herokuapp.com/", //may need to change when deploying
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
        console.log("Joining room");
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
            socket.leave(room);
        });
    });
});

server.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});
