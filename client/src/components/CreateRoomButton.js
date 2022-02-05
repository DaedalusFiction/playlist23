import { useNavigate } from "react-router-dom";

const CreateRoomButton = () => {
    const navigate = useNavigate();
    const createRoom = () => {
        const newRoom = Math.floor(1000 + Math.random() * 9000);

        navigate(`/rooms/${newRoom}`);
    };
    return (
        <label className="btn">
            <button onClick={createRoom} /> Create Room
        </label>
    );
};

export default CreateRoomButton;
