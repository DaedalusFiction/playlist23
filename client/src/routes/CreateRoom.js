import CreateRoomButton from "../components/CreateRoomButton";
import UsernameInput from "../components/UsernameInput";

const CreateRoom = ({ createRoom, enterUsername }) => {
    return (
        <div className="create-room">
            <div className="container">
                <UsernameInput enterUsername={enterUsername} />
                <CreateRoomButton createRoom={createRoom} />
            </div>
        </div>
    );
};

export default CreateRoom;
