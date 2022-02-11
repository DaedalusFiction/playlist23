import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./routes/Home";
import Layout from "./components/Layout";
import CreateRoom from "./routes/CreateRoom";
import JoinRoom from "./routes/JoinRoom";
import Rooms from "./routes/Rooms";
import Room from "./routes/Room";
import About from "./routes/About";
import NoPage from "./routes/NoPage";

function App() {
    const [joinedRooms, setJoinedRooms] = useState(["charles"]);
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="createRoom" element={<CreateRoom />} />
                    <Route path="joinRoom" element={<JoinRoom />} />
                    <Route path="about" element={<About />} />
                    <Route
                        path="rooms"
                        element={
                            <Rooms
                                joinedRooms={joinedRooms}
                                setJoinedRooms={setJoinedRooms}
                            />
                        }
                    >
                        <Route
                            path={":roomID"}
                            element={
                                <Room
                                    joinedRooms={joinedRooms}
                                    setJoinedRooms={setJoinedRooms}
                                />
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
