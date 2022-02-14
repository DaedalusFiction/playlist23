import { useParams } from "react-router-dom";
import { useEffect } from "react";

import "moment-timezone";
import SongPanel from "../components/SongPanel";
import ChatPanel from "../components/ChatPanel";
import { socket } from "../socket/socket";

const Room = ({ joinedRooms, setJoinedRooms, username, setUsername }) => {
    const params = useParams();

    useEffect(() => {
        //emit join room event to server index socket
        socket.emit("joinRoom", `${params.roomID}`);
        if (!joinedRooms.includes(params.roomID)) {
            setJoinedRooms([...joinedRooms, params.roomID]);
        }

        return () => {
            //leave room whenever component unmounts
            socket.emit("leavingRoom", params.roomID);
        };
    }, [params.roomID]);

    const changeUsername = (e) => {
        setUsername(e.target.value);
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
