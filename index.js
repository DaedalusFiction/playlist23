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

        //notify all other users in room that user has joined
        socket.broadcast.emit("chatMessage", {
            time: moment().format("h:mm a"),
            key: Date.now(),
            room: room,
            user: "playlist: 23",
            message: `a user has joined the chat`,
        });

        //welcome connected user
        socket.emit("chatMessage", {
            time: moment().format("h:mm a"),
            key: Date.now(),
            room: room,
            user: "playlist: 23",
            message: `welcome to room: ${room}`,
        });

        //chatbox event listener
        const msgListener = (message) => {
            io.in(room).emit("chatMessage", message);
        };
        socket.on("sendMessage", msgListener);

        //update song panel list listener
        const updateSonglistListener = (song) => {
            io.in(room).emit("updateSonglist", "song");
        };
        socket.on("updateSonglist", updateSonglistListener);

        //play song listener
        const playSongListener = (song) => {
            io.in(room).emit("playSong", song);
        };
        socket.on("playSong", playSongListener);

        //pause song listener
        const pauseSongListener = (pause) => {
            io.in(room).emit("pauseSong", pause);
        };
        socket.on("pauseSong", pauseSongListener);

        //leaves room and turns off listeners so that multiple listeners are not created
        //problem was that every time "joinRoom" was called it would add redundant listeners and emit duplicate messages
        socket.on("leavingRoom", (roomNumber) => {
            socket.off("sendMessage", msgListener);
            socket.off("updateSongList", updateSonglistListener);
            socket.off("playSong", playSongListener);
            socket.off("pauseSong", pauseSongListener);

            //notifies all other users when user navigates away from Room
            socket.broadcast.emit("chatMessage", {
                time: moment().format("h:mm a"),
                key: Date.now(),
                room: room,
                user: "playlist: 23",
                message: `a user has left the chat`,
            });
        });

        //dupicated so that will also notify other users when user closes tab
        socket.on("disconnect", () => {
            socket.broadcast.emit("chatMessage", {
                time: moment().format("h:mm a"),
                key: Date.now(),
                room: room,
                user: "playlist: 23",
                message: `a user has left the chat`,
            });
        });
    });
});

server.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});
