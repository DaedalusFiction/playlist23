import CreateRoomButton from "../components/CreateRoomButton";
import UsernameInput from "../components/UsernameInput";

const CreateRoom = ({ createRoom, enterUsername }) => {
    return (
        <>
            <UsernameInput enterUsername={enterUsername} />
            <CreateRoomButton createRoom={createRoom} />
        </>
    );
};

export default CreateRoom;
