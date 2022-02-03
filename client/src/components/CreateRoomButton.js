const CreateRoomButton = ({ createRoom }) => {
    return (
        <label className="btn">
            <button onClick={createRoom} /> Create Room
        </label>
    );
};

export default CreateRoomButton;
