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
        socket.emit("chatMessage", {
            time: moment().format("h:mm a"),
            key: Date.now(),
            room: room,
            user: "playlist: 23",
            message: `welcome to room: ${room}`,
        });

        const msgListener = (message) => {
            io.in(room).emit("chatMessage", message);
            console.log("sending message");
        };
        //send message to everyone in joined room
        socket.on("sendMessage", msgListener);

        socket.on("updateSonglist", (song) => {
            io.in(room).emit("updateSonglist", "song");
            console.log("updating songlist");
        });

        socket.on("playSong", (song) => {
            io.in(room).emit("playSong", "song");
            console.log("playing the songggg");
        });

        socket.on("pauseSong", (pause) => {
            io.in(room).emit("pauseSong", pause);
        });

        socket.on("leavingRoom", (roomNumber) => {
            console.log("turning off listnerer");
            socket.off("sendMessage", msgListener);
        });
        // socket.on("disconnect", () => {
        //     socket.broadcast.emit("chatMessage", {
        //         time: moment().format("h:mm a"),
        //         key: Date.now(),
        //         room: room,
        //         user: "playlist: 23",
        //         message: `a user has left the chat`,
        //     });
        //     console.log("client diesconnecting");
        // });
    });

    socket.on("leaveRoom", (room) => {
        socket.leave(room);
        // socket.off("sendMessage");
        // socket.off("playSong");
        // socket.off("pauseSong");
        console.log("leaving room");
    });
});

server.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});
