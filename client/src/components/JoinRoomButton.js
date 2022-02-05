import { useNavigate } from "react-router-dom";
import { useState } from "react";

const JoinRoomButton = () => {
    const navigate = useNavigate();
    const [joinError, setJoinError] = useState(false);
    const [roomNumber, setRoomNumber] = useState(0);
    const enterRoomNumber = (e) => {
        setRoomNumber(e.target.value);
    };

    const joinRoom = () => {
        if (roomNumber > 1000 && roomNumber < 9999) {
            setJoinError(false);
            navigate(`/rooms/${roomNumber}`);
        } else {
            setJoinError(true);
        }
    };

    const handleKeyPress = (e) => {
        if (e.code === "Enter") {
            joinRoom();
        }
    };
    return (
        <>
            <div className="join-room-button">
                <input
                    type="text"
                    onChange={enterRoomNumber}
                    placeholder="Enter room number"
                    onKeyPress={handleKeyPress}
                />
                <label className="btn" onClick={joinRoom}>
                    <button onClick={joinRoom} />
                    Join
                </label>
            </div>
            <div className="join-errors">
                {roomNumber > 0 && roomNumber < 1000 && joinError && (
                    <p>Room number must be four digits</p>
                )}
                {joinError && <p>Room Number not found</p>}
            </div>
        </>
    );
};

export default JoinRoomButton;
