const JoinRoomButton = ({
    roomNumber,
    enterRoomNumber,
    joinRoom,
    joinError,
}) => {
    return (
        <div>
            <input
                type="text"
                onChange={enterRoomNumber}
                placeholder="Enter four-digit room number"
            />
            <button onClick={joinRoom}>Join Room</button>
            {roomNumber > 0 && roomNumber < 1000 && joinError && (
                <p>Room number must be four digits</p>
            )}
            {joinError && <p>Room Number not found</p>}
        </div>
    );
};

export default JoinRoomButton;
