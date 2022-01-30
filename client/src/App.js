import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./routes/Home";
import Layout from "./components/Layout";
import CreateRoom from "./routes/CreateRoom";
import JoinRoom from "./routes/JoinRoom";
import Rooms from "./routes/Rooms";
import Room from "./routes/Room";
import About from "./routes/About";
import NoPage from "./routes/NoPage";

function App() {
    const [username, setUsername] = useState("anonymous");
    const [roomNumber, setRoomNumber] = useState(0);
    const [joinError, setJoinError] = useState(false);
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate();

    const enterUsername = (e) => {
        setUsername(e.target.value);
    };
    const enterRoomNumber = (e) => {
        setRoomNumber(e.target.value);
        setJoinError(false);
    };

    const joinRoom = () => {
        if (roomNumber > 1000 && roomNumber < 9999) {
            setJoinError(false);
            navigate(`/rooms/${roomNumber}`);
        } else {
            setJoinError(true);
        }
    };

    const createRoom = () => {
        const newRoom = Math.floor(1000 + Math.random() * 9000);
        setRoomNumber(newRoom);
        navigate(`/rooms/${newRoom}`);
    };

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        index
                        element={
                            <Home
                                enterUsername={enterUsername}
                                roomNumber={roomNumber}
                                enterRoomNumber={enterRoomNumber}
                                joinRoom={joinRoom}
                                createRoom={createRoom}
                                joinError={joinError}
                            />
                        }
                    />
                    <Route
                        path="createRoom"
                        element={
                            <CreateRoom
                                createRoom={createRoom}
                                enterUsername={enterUsername}
                            />
                        }
                    />
                    <Route
                        path="joinRoom"
                        element={
                            <JoinRoom
                                joinRoom={joinRoom}
                                roomNumber={roomNumber}
                                enterRoomNumber={enterRoomNumber}
                                joinError={joinError}
                            />
                        }
                    />
                    <Route path="about" element={<About socket={socket} />} />
                    <Route path="rooms" element={<Rooms username={username} />}>
                        <Route
                            path={":roomID"}
                            element={
                                <Room username={username} socket={socket} />
                            }
                        />
                    </Route>
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
