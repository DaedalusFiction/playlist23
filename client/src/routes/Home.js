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
            <UsernameInput enterUsername={enterUsername} />
            <JoinRoomButton
                joinRoom={joinRoom}
                roomNumber={roomNumber}
                enterRoomNumber={enterRoomNumber}
                joinError={joinError}
            />
            <CreateRoomButton createRoom={createRoom} />
        </>
    );
};
export default Home;
