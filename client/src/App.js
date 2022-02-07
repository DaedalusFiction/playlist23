import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Layout from "./components/Layout";
import CreateRoom from "./routes/CreateRoom";
import JoinRoom from "./routes/JoinRoom";
import Rooms from "./routes/Rooms";
import Room from "./routes/Room";
import About from "./routes/About";
import NoPage from "./routes/NoPage";
import Bubbles from "./components/Bubbles";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="createRoom" element={<CreateRoom />} />
                    <Route path="joinRoom" element={<JoinRoom />} />
                    <Route path="about" element={<About />} />
                    <Route path="rooms" element={<Rooms />}>
                        <Route path={":roomID"} element={<Room />} />
                    </Route>
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
