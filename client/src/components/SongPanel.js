import { useState, useEffect, useCallback } from "react";
import MusicPlayer from "./MusicPlayer";
import SongBox from "./SongBox";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { socket } from "../socket/socket";

import { storage } from "../firebase";
import { ref } from "firebase/storage";
import { updateDoc, arrayUnion } from "firebase/firestore";
import { uploadBytesResumable } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";

// import socketIOClient from "socket.io-client";
const SongPanel = ({ username }) => {
    const params = useParams();
    const [songs, setSongs] = useState([]);
    const [nowPlaying, setNowPlaying] = useState(null);
    const [playingMusic, setPlayingMusic] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const getsonglist = useCallback(async () => {
        //get songlist from firebase and set state
        const roomRef = doc(db, "rooms", params.roomID);
        const songlistTask = await getDoc(roomRef);
        if (songlistTask.exists()) {
            setSongs(songlistTask.data().songlist);
            //scroll to bottom
            let songbox = document.getElementById("control-panel");
            songbox.scrollTop = songbox.scrollHeight;
        }
    }, [params.roomID]);

    useEffect(() => {
        //get song list on page load
        getsonglist();
    }, [getsonglist]);

    useEffect(() => {
        socket.on("updateSonglist", () => {
            getsonglist();
        });

        return () => {
            socket.off("updateSonglist");
        };
    }, [getsonglist]);

    const selectSong = (e) => {
        const previousID = nowPlaying;
        // checks to see if clicked song is not also the currently selected song
        if (previousID === null || previousID.url !== songs[e.target.id].url) {
            setNowPlaying(songs[e.target.id]);
            setPlayingMusic(false);
        }
    };

    //handle drag and drop file uploading

    const handleDragOver = (e) => {
        e.preventDefault();
        // console.log("handled drag over");
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
    };

    // const handleDrop = (e) => {
    //     e.preventDefault();
    //     console.log(e.dataTransfer.files[0].name);
    // };

    const handleDrop = async (e) => {
        e.preventDefault();
        if (e.dataTransfer.files !== null) {
            const selected = e.dataTransfer.files[0];
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
                                title: selected.name,
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
            <div className="song-panel">
                <div
                    className="control-panel"
                    id="control-panel"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDrop={handleDrop}
                >
                    {songs.length === 0 || isUploading ? (
                        <p
                            className="add-song-prompt"
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDrop={handleDrop}
                        >
                            {isUploading ? (
                                <i className="fa fa-spinner spin"></i>
                            ) : (
                                "drop an .mp3, .ogg or .FLAC file here"
                            )}
                        </p>
                    ) : (
                        songs.map((song, index) => {
                            return (
                                <SongBox
                                    key={index}
                                    index={index}
                                    song={song}
                                    onClick={selectSong}
                                />
                            );
                        })
                    )}
                </div>
                <MusicPlayer
                    username={username}
                    nowPlaying={nowPlaying}
                    setNowPlaying={setNowPlaying}
                    playingMusic={playingMusic}
                    setPlayingMusic={setPlayingMusic}
                />
            </div>
        </div>
    );
};

export default SongPanel;
