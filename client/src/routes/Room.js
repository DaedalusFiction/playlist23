import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import "moment-timezone";
import SongPanel from "../components/SongPanel";
import ChatPanel from "../components/ChatPanel";
import { socket } from "../socket/socket";

const Room = ({ joinedRooms, setJoinedRooms }) => {
    const [username, setusername] = useState(
        "anonymous" + Math.floor(1000 + Math.random() * 9000)
    );
    const params = useParams();

    useEffect(() => {
        console.log(joinedRooms);
        socket.emit("joinRoom", `${params.roomID}`);
        if (!joinedRooms.includes(params.roomID)) {
            setJoinedRooms([...joinedRooms, params.roomID]);
        }

        return () => {
            socket.emit("leavingRoom", params.roomID);
            console.log("leaving room now");
        };
    }, [params.roomID]);

    const changeUsername = (e) => {
        setusername(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.code === "Enter" && e.target.id === "usernameInput") {
            document.getElementById("usernameInput").blur();
        }
    };

    return (
        <>
            <div className="room">
                <div className="container">
                    <div className="room-info">
                        <p>username: </p>
                        <input
                            id="usernameInput"
                            type="text"
                            placeholder={username}
                            onChange={changeUsername}
                            onKeyPress={handleKeyPress}
                        />
                        <p>room: {params.roomID}</p>
                    </div>

                    <div className="room-content">
                        <SongPanel username={username} />
                        <ChatPanel username={username} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Room;
