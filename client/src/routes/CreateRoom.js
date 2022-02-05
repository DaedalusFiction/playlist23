import CreateRoomButton from "../components/CreateRoomButton";

const CreateRoom = ({ createRoom }) => {
    return (
        <div className="create-room">
            <div className="container">
                <CreateRoomButton createRoom={createRoom} />
            </div>
        </div>
    );
};

export default CreateRoom;
