import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Layout from "./components/Layout";
import CreateRoom from "./routes/CreateRoom";
import JoinRoom from "./routes/JoinRoom";
import Rooms from "./routes/Rooms";
import Room from "./routes/Room";
import About from "./routes/About";
import NoPage from "./routes/NoPage";

const ENDPOINT = "http://localhost:4001";

const socket = socketIOClient.connect(ENDPOINT);

socket.on("message", (message) => {
    console.log(message);
});

function App() {
    const [username, setUsername] = useState("anonymous");
    const [roomNumber, setRoomNumber] = useState("");

    const enterUsername = (e) => {
        setUsername(e.target.value);
        console.log(username);
    };
    const enterRoomNumber = (e) => {
        setRoomNumber(e.target.value);
        console.log(roomNumber);
    };

    const joinRoom = (e) => {
        console.log("joining room");
    };

    const createRoom = () => {
        console.log("room created");
    };

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route
                            index
                            element={
                                <Home
                                    enterUsername={enterUsername}
                                    enterRoomNumber={enterRoomNumber}
                                    joinRoom={joinRoom}
                                    createRoom={createRoom}
                                />
                            }
                        />
                        <Route path="createRoom" element={<CreateRoom />} />
                        <Route path="joinRoom" element={<JoinRoom />} />
                        <Route path="about" element={<About />} />
                        <Route path="rooms" element={<Rooms />}>
                            <Route path={"/" + roomNumber} element={<Room />} />
                        </Route>
                        <Route path="*" element={<NoPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
