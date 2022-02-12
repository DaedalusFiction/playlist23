import SongUploader from "./SongUploader";
import { useEffect, useRef } from "react";
import { socket } from "../socket/socket";
import styles from "../styles/rangeInput.css";
import { useParams } from "react-router-dom";

const MusicPlayer = ({
    username,
    nowPlaying,
    setNowPlaying,
    playingMusic,
    setPlayingMusic,
}) => {
    const player = useRef();
    const params = useParams();
    useEffect(() => {
        //set up listeners
        socket.on("playSong", (song) => {
            setNowPlaying(song.song);
            player.current.play();
            setPlayingMusic(true);
        });
        socket.on("pauseSong", () => {
            player.current.pause();
            setPlayingMusic(false);
        });

        return () => {
            //clean up listeners
            socket.off("playSong");
            socket.off("pauseSong");
        };
    }, [setNowPlaying, setPlayingMusic]);

    const playPause = () => {
        if (nowPlaying) {
            player.current.onended = () => {
                setPlayingMusic(false);
            };
            const currentTime = player.current.currentTime;
            if (!playingMusic) {
                socket.emit("playSong", {
                    room: params.roomID,
                    song: nowPlaying,
                    time: currentTime,
                });
            } else {
                socket.emit("pauseSong", params.roomID);
            }
        }
    };

    return (
        <div>
            {nowPlaying && (
                <p className="now-playing">now playing: {nowPlaying.title}</p>
            )}
            <input
                type="range"
                id="slider"
                className="song-slider"
                min="0"
                max="100"
            />
            {nowPlaying && (
                <div className="song-timer">
                    <div className="song-time-current">0</div>
                    <p>/</p>
                    <div className="song-time-duration">
                        {player.current.duration}
                    </div>
                </div>
            )}
            <div className="song-controls">
                <p>group controls: </p>
                <SongUploader username={username} />

                <label className="btn">
                    <button id="play" onClick={playPause} />
                    <i
                        className={
                            playingMusic ? "fas fa-pause" : "fas fa-play"
                        }
                    ></i>
                </label>

                <audio
                    id="reactAudioPlayer"
                    ref={player}
                    src={nowPlaying && nowPlaying.url}
                    controls
                    preload="metadata"
                />
            </div>
        </div>
    );
};

export default MusicPlayer;
