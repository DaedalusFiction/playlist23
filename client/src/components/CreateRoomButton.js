import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const CreateRoomButton = () => {
    const navigate = useNavigate();
    const createRoom = async () => {
        const newRoom = generateRoomNumber(4);
        const roomRef = doc(db, "rooms", newRoom.toString());
        const room = await getDoc(roomRef);
        if (room.exists()) {
            console.log("room exists");
            setTimeout(() => {
                //if room already exists, recursively attempts to get a new one
                // createRoom();
                console.log("room still exists");
            }, 1000);
        } else {
            const setTask = await setDoc(roomRef, {
                owner: "anonymous",
                songlist: [],
            });
            navigate(`/rooms/${newRoom}`);
        }
    };

    function generateRoomNumber(length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
    }

    return (
        <label className="btn">
            <button onClick={createRoom} /> Create Room
        </label>
    );
};

export default CreateRoomButton;
