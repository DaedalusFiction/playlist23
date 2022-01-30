import JoinRoomButton from "../components/JoinRoomButton";

const JoinRoom = ({ joinRoom, roomNumber, enterRoomNumber, joinError }) => {
    return (
        <JoinRoomButton
            joinRoom={joinRoom}
            roomNumber={roomNumber}
            enterRoomNumber={enterRoomNumber}
            joinError={joinError}
        />
    );
};

export default JoinRoom;
