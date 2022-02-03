import JoinRoomButton from "../components/JoinRoomButton";

const JoinRoom = ({ joinRoom, roomNumber, enterRoomNumber, joinError }) => {
    return (
        <div className="join-room">
            <div className="container">
                <JoinRoomButton
                    joinRoom={joinRoom}
                    roomNumber={roomNumber}
                    enterRoomNumber={enterRoomNumber}
                    joinError={joinError}
                />
            </div>
        </div>
    );
};

export default JoinRoom;
