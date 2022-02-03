const JoinRoomButton = ({
    roomNumber,
    enterRoomNumber,
    joinRoom,
    joinError,
}) => {
    return (
        <>
            <div className="join-room-button">
                <input
                    type="text"
                    onChange={enterRoomNumber}
                    placeholder="Enter room number"
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
