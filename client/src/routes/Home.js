const Home = ({ enterUsername, enterRoomNumber, joinRoom, createRoom }) => {
    return (
        <>
            <input
                type="text"
                onChange={enterUsername}
                placeholder="Enter Username"
            />
            <input
                type="text"
                onChange={enterRoomNumber}
                placeholder="enter room number"
            />
            <button onClick={joinRoom}>Join Room</button>
            <button onClick={createRoom}>Create Room</button>
        </>
    );
};
export default Home;
