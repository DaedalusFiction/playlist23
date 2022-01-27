const Home = ({ enterUsername, createRoom }) => {
    return (
        <>
            <input
                type="text"
                onChange={enterUsername}
                placeholder="Enter Username"
            />
            <button onClick={createRoom}>Create Room</button>
        </>
    );
};
export default Home;
