import SongUploader from "./SongUploader";
import { useEffect, useState, useRef } from "react";
import { socket } from "../socket/socket";
import styles from "../styles/rangeInput.css";
import { useParams } from "react-router-dom";
import moment from "moment";

//icons
import { FaVolumeUp } from "react-icons/fa";
import { FaVolumeMute } from "react-icons/fa";

const MusicPlayer = ({
    username,
    nowPlaying,
    setNowPlaying,
    playingMusic,
    setPlayingMusic,
}) => {
    const [songDuration, setSongDuration] = useState(0);
    const [songCurrentTime, setSongCurrentTime] = useState(0);
    const [muted, setMuted] = useState(false);

    const player = useRef(); //references audio player
    const progressBar = useRef(); //references progress bar
    const animationRef = useRef();

    const params = useParams();

    useEffect(() => {
        //set up listeners
        socket.on("playSong", (song) => {
            setNowPlaying(song.song);
            player.current.currentTime = song.time;
            player.current.play();

            setPlayingMusic(true);
            animationRef.current = requestAnimationFrame(animateProgressBar);
        });
        socket.on("pauseSong", () => {
            player.current.pause();
            setPlayingMusic(false);
            cancelAnimationFrame(animationRef.current);
        });

        return () => {
            //clean up listeners
            socket.off("playSong");
            socket.off("pauseSong");
            cancelAnimationFrame(animationRef.current);
        };
    }, [setNowPlaying, setPlayingMusic]);

    useEffect(() => {
        if (playingMusic) {
            setSongCurrentTime(player.current.currentTime);
        }
    }, [playingMusic, player?.current?.currentTime]);

    useEffect(() => {
        setSongCurrentTime(0);
        setBeforeBarStyle(0);
    }, [nowPlaying]);

    const playPause = () => {
        if (nowPlaying) {
            player.current.onended = () => {
                setPlayingMusic(false);
                setSongCurrentTime(0);
                setBeforeBarStyle(0);
                player.current.currentTime = 0;
                progressBar.current.value = 0;
                cancelAnimationFrame(animationRef.current);
            };
            const currentTime = player.current.currentTime;
            if (!playingMusic) {
                socket.emit("playSong", {
                    room: params.roomID,
                    song: nowPlaying,
                    time: currentTime,
                });
                const songMessage = {
                    time: moment().format("h:mm a"),
                    key: Date.now(),
                    room: params.roomID,
                    user: "playlist: 23",
                    message: `Now Playing: ${nowPlaying.title}`,
                };
                socket.emit("sendMessage", songMessage);
            } else {
                socket.emit("pauseSong", params.roomID);
            }
        }
    };

    const mute = () => {
        if (muted) {
            player.current.muted = false;
            setMuted(false);
        } else {
            player.current.muted = true;
            setMuted(true);
        }
    };

    const animateProgressBar = () => {
        progressBar.current.value = player.current.currentTime;
        setBeforeBarStyle(player.current.currentTime);
        setSongCurrentTime(player.current.currentTime);
        animationRef.current = requestAnimationFrame(animateProgressBar);
    };

    const handleProgressBarChange = () => {
        player.current.currentTime = progressBar.current.value;
        setBeforeBarStyle(player.current.currentTime);
    };

    const setBeforeBarStyle = (time) => {
        progressBar.current.style.setProperty(
            "--seek-before-width",
            `${(time / player.current.duration) * 100}%`
        );
        // setSongCurrentTime(progressBar.current.value);
    };

    const handleOnLoadedMetadata = () => {
        const duration = Math.floor(player.current.duration);
        const formattedDuration = new Date(duration * 1000)
            .toISOString()
            .substr(14, 5);

        setSongDuration(formattedDuration);
        progressBar.current.max = player.current.duration;
    };

    const handleMouseDown = () => {
        player.current.pause();
        setPlayingMusic(false);
        cancelAnimationFrame(animationRef.current);
    };

    const formatTime = (seconds) => {
        const time = Math.floor(seconds);
        const formattedTime = new Date(time * 1000).toISOString().substr(14, 5);

        return formattedTime;
    };

    return (
        <div>
            {nowPlaying ? (
                <p className="now-playing">now playing: {nowPlaying.title}</p>
            ) : (
                <p className="now-playing">no song selected</p>
            )}
            <div className="music-controls">
                <SongUploader username={username} />
                <label className="btn">
                    <button id="play" onClick={playPause} />
                    <i
                        className={
                            playingMusic ? "fas fa-pause" : "fas fa-play"
                        }
                    ></i>
                </label>
                <input
                    type="range"
                    className="progressBar"
                    defaultValue="0"
                    step="0.001"
                    ref={progressBar}
                    onChange={handleProgressBarChange}
                    onMouseDown={handleMouseDown}
                />
                <label className="btn btn-mute">
                    <button id="mute" onClick={mute} />
                    <i>{muted ? <FaVolumeMute /> : <FaVolumeUp />}</i>
                </label>
            </div>
            {nowPlaying && (
                <div className="song-timer">
                    <div className="song-time-current">
                        {/* {formatTime(player.current.currentTime)} */}
                        {formatTime(songCurrentTime)}
                    </div>
                    <p>/</p>
                    <div className="song-time-duration">{songDuration}</div>
                </div>
            )}
            <div className="song-controls">
                <audio
                    id="reactAudioPlayer"
                    ref={player}
                    src={nowPlaying && nowPlaying.url}
                    controls
                    preload="metadata"
                    onLoadedMetadata={handleOnLoadedMetadata}
                />
            </div>
        </div>
    );
};

export default MusicPlayer;
