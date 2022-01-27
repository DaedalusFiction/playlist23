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
    const [roomPath, setRoomPath] = useState("12345");
    const [username, setUsername] = useState("anonymous");

    const enterUsername = (e) => {
        setUsername(e.target.value);
        console.log(username);
    };

    const createRoom = () => {
        console.log("room created");
        setRoomPath("3434");
        console.log(roomPath);
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
                                    createRoom={createRoom}
                                />
                            }
                        />
                        <Route path="createRoom" element={<CreateRoom />} />
                        <Route path="joinRoom" element={<JoinRoom />} />
                        <Route path="about" element={<About />} />
                        <Route path="rooms" element={<Rooms />}>
                            <Route path=":roomID" element={<Room />} />
                        </Route>
                        <Route path="*" element={<NoPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
