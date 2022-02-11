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

        const updateSonglistListener = (song) => {
            io.in(room).emit("updateSonglist", "song");
        };
        socket.on("updateSonglist", updateSonglistListener);

        const playSongListener = (song) => {
            io.in(room).emit("playSong", song);
            console.log("playing the songggg");
        };
        socket.on("playSong", playSongListener);

        const pauseSongListener = (pause) => {
            io.in(room).emit("pauseSong", pause);
        };
        socket.on("pauseSong", pauseSongListener);

        socket.on("leavingRoom", (roomNumber) => {
            socket.off("sendMessage", msgListener);
            socket.off("updateSongList", updateSonglistListener);
            socket.off("playSong", playSongListener);
            socket.off("pauseSong", pauseSongListener);
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
});

server.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});
