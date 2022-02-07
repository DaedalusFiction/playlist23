import React from "react";
import { db, storage } from "../firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import moment from "moment";

const SongUploader = ({ username, roomID, socket }) => {
    const uploadFile = async (e) => {
        console.log(e.target.files[0].name);
        if (e.target.value !== null) {
            const selected = e.target.files[0];
            const roomRef = doc(db, "rooms", roomID);
            const storageRef = ref(storage, selected.name);
            const uploadTask = uploadBytesResumable(storageRef, selected);
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
                            const newMessage = {
                                time: moment().format("h:mm a"),
                                key: Date.now(),
                                room: roomID,
                                user: "playlist: 23",
                                message: "new song uploaded",
                            };
                            socket.emit("sendMessage", newMessage);
                        }
                    );
                }
            );
        }
    };
    return (
        <label className="btn">
            <input type="file" onChange={uploadFile} accept="audio/*" />
            add song
        </label>
    );
};

export default SongUploader;
