import React from "react";
import { db, storage } from "../firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { socket } from "../socket/socket";

const SongUploader = ({ username }) => {
    const params = useParams();
    //to change display of upload button
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const uploadFile = async (e) => {
        if (e.target.value !== null) {
            const selected = e.target.files[0];
            const roomRef = doc(db, "rooms", params.roomID);
            const storageRef = ref(storage, selected.name);

            //upload to firebase storage
            const uploadTask = uploadBytesResumable(storageRef, selected);
            setIsUploading(true);

            uploadTask.on(
                "state_changed",
                (snapshot) => {},
                (error) => {
                    if (error.code === "storage/unauthorized") {
                        console.log("storage: unauthorized");
                        setUploadError("size");
                    }

                    setIsUploading(false);
                },
                () => {
                    // uses returned URL to create firestore database entry
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        async (downloadURL) => {
                            const newSong = {
                                room: params.roomID,
                                artist: username,
                                title: e.target.files[0].name,
                                url: downloadURL,
                            };
                            await updateDoc(roomRef, {
                                owner: username,
                                songlist: arrayUnion(newSong),
                            });

                            //emit event to server index socket to refresh all users' song panel to show newly added songbox
                            socket.emit("updateSonglist", params.roomID);
                            setIsUploading(false);
                            setUploadError(null);
                        }
                    );
                }
            );
        }
    };

    return (
        <div>
            <label className="btn">
                <input
                    type="file"
                    onChange={uploadFile}
                    accept=".mp3, .ogg, .FLAC"
                />
                <i
                    className={
                        isUploading ? "fas fa-spinner spin" : "fas fa-plus"
                    }
                ></i>
            </label>
            {uploadError === "size" && (
                <p className="upload-error">
                    error: file must be less than 10 MB
                </p>
            )}
        </div>
    );
};

export default SongUploader;
