import React from "react";
import { db, storage } from "../firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { socket } from "../socket/socket";

const SongUploader = ({ username }) => {
    const params = useParams();
    const [isUploading, setIsUploading] = useState(false);

    const uploadFile = async (e) => {
        console.log(e.target.files[0].name);
        if (e.target.value !== null) {
            const selected = e.target.files[0];
            const roomRef = doc(db, "rooms", params.roomID);
            const storageRef = ref(storage, selected.name);
            const uploadTask = uploadBytesResumable(storageRef, selected);
            setIsUploading(true);
            uploadTask.on(
                "state_changed",
                (snapshot) => {},
                (error) => {},
                () => {
                    // creates firestore database entry
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        async (downloadURL) => {
                            const newSong = {
                                artist: username,
                                title: e.target.files[0].name,
                                url: downloadURL,
                            };
                            await updateDoc(roomRef, {
                                owner: username,
                                songlist: arrayUnion(newSong),
                            });

                            socket.emit("updateSonglist", "song");
                            setIsUploading(false);
                        }
                    );
                }
            );
        }
    };
    return (
        <label className="btn">
            <input
                type="file"
                onChange={uploadFile}
                accept=".mp3, .ogg, .FLAC"
            />
            <i
                className={isUploading ? "fas fa-spinner spin" : "fas fa-plus"}
            ></i>
            {/* <i className="fas fa-spinner"></i> */}
        </label>
    );
};

export default SongUploader;
