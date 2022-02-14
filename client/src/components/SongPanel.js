import { useState, useEffect, useCallback } from "react";
import MusicPlayer from "./MusicPlayer";
import SongBox from "./SongBox";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { socket } from "../socket/socket";

// import socketIOClient from "socket.io-client";
const SongPanel = ({ username }) => {
    const params = useParams();
    const [songs, setSongs] = useState([]);
    const [nowPlaying, setNowPlaying] = useState(null);
    const [playingMusic, setPlayingMusic] = useState(false);

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
    return (
        <div>
            <div className="song-panel">
                <div className="control-panel" id="control-panel">
                    {songs.length > 0 ? (
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
                    ) : (
                        <p className="add-song-prompt">
                            add a song to get started
                        </p>
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
