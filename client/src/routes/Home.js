import CreateRoomButton from "../components/CreateRoomButton";
import JoinRoomButton from "../components/JoinRoomButton";
import UsernameInput from "../components/UsernameInput";

const Home = ({
    enterUsername,
    roomNumber,
    enterRoomNumber,
    joinRoom,
    createRoom,
    joinError,
}) => {
    return (
        <>
            <main className="home">
                <div className="container">
                    <div className="flex">
                        <div className="home-left">
                            <div className="home-buttons">
                                <UsernameInput enterUsername={enterUsername} />
                                <p>and</p>
                                <JoinRoomButton
                                    joinRoom={joinRoom}
                                    roomNumber={roomNumber}
                                    enterRoomNumber={enterRoomNumber}
                                    joinError={joinError}
                                />
                                <p>or</p>
                                <CreateRoomButton createRoom={createRoom} />
                            </div>
                        </div>
                        <div className="home-right">
                            <div className="home-hero">
                                <p>a simpler way to</p>
                                <p>share your</p>
                                <p>music</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};
export default Home;
