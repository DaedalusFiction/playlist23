import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import socketIOClient from "socket.io-client";

import moment from "moment";
import "moment-timezone";
import ChatMessage from "../components/ChatMessage";
import SongBox from "../components/SongBox";
import SongUploader from "../components/SongUploader";
import { getDoc, doc } from "firebase/firestore";

const Room = () => {
    const [username, setusername] = useState("anonymous");
    const params = useParams();
    const ENDPOINT = "http://localhost:4001";
    //socket create as useState element and initialized so that it won't create a new connection every time page rerenders
    const [socket, setSocket] = useState(socketIOClient.connect(ENDPOINT));
    const player = document.getElementById("reactAudioPlayer");

    const [chatMessages, setChatMessages] = useState([
        //welcome message
        {
            time: moment().format("h:mm a"),
            key: Date.now(),
            room: params.roomID,
            user: username,
            message: `Welcome to room: ${params.roomID}`,
        },
    ]);

    const [songs, setSongs] = useState([]);
    const [nowPlaying, setNowPlaying] = useState(null);

    useEffect(() => {
        socket.emit("joinRoom", params.roomID);
    }, [params.roomID, socket]);

    useEffect(() => {
        async function getsonglist() {
            const roomRef = doc(db, "rooms", params.roomID);
            const songlistTask = await getDoc(roomRef);
            if (songlistTask.exists()) {
                setSongs(songlistTask.data().songlist);
                let songbox = document.getElementById("control-panel");
                songbox.scrollTop = songbox.scrollHeight;
            }
        }
        getsonglist();
    }, [params.roomID, socket, chatMessages]);

    useEffect(() => {
        //add listener for new chat messages, updates messages
        socket.on("chatMessage", (message) => {
            setChatMessages([...chatMessages, message]);
            let chatbox = document.getElementById("chat-box");
            chatbox.scrollTop = chatbox.scrollHeight;
        });

        socket.on("addSong", (song) => {
            console.log("song added");
        });

        socket.on("playSong", (song) => {
            const player = document.getElementById("reactAudioPlayer");
            setNowPlaying(song.song);
            player.currentTime = song.time;
            player.play();
        });

        socket.on("pauseSong", () => {
            player.pause();
        });

        return () => {
            //clean up listeners
            socket.removeAllListeners();
        };
    }, [chatMessages, socket, player, songs]);

    useEffect(() => {
        //sets focus to chat box on page load
        document.getElementById("chatMessageInput").focus();
    }, []);

    const changeUsername = (e) => {
        setusername(e.target.value);
    };

    const sendMessage = () => {
        const msg = document.getElementById("chatMessageInput").value;
        if (msg !== "") {
            const newMessage = {
                time: moment().format("h:mm a"),
                key: Date.now(),
                room: params.roomID,
                user: username,
                message: msg,
            };

            socket.emit("sendMessage", newMessage);

            document.getElementById("chatMessageInput").value = "";
        }
    };

    const playSong = () => {
        const player = document.getElementById("reactAudioPlayer");
        if (nowPlaying) {
            const currentTime = player.currentTime;
            socket.emit("playSong", {
                song: nowPlaying,
                time: currentTime,
            });
        }
    };

    const handleKeyPress = (e) => {
        if (e.code === "Enter" && e.target.id === "chatMessageInput") {
            sendMessage();
        } else if (e.code === "Enter" && e.target.id === "usernameInput") {
            document.getElementById("chatMessageInput").focus();
        }
    };

    const selectSong = (e) => {
        console.log(songs[e.target.id].url);
        setNowPlaying(songs[e.target.id]);
    };

    const pauseSong = () => {
        socket.emit("pauseSong", "pause");
    };

    const testButton = () => {
        console.log(player.paused);
    };

    return (
        <>
            <div className="room">
                <div className="container">
                    <div className="room-info">
                        <p>username: </p>
                        <input
                            id="usernameInput"
                            type="text"
                            placeholder={username}
                            onChange={changeUsername}
                            onKeyPress={handleKeyPress}
                        />
                        <p>room: {params.roomID}</p>
                    </div>

                    <div className="room-content">
                        <div className="song-panel">
                            <div className="control-panel" id="control-panel">
                                {songs.map((song, index) => {
                                    return (
                                        <SongBox
                                            key={index}
                                            index={index}
                                            song={song}
                                            onClick={selectSong}
                                        />
                                    );
                                })}
                            </div>
                            {nowPlaying && (
                                <p className="now-playing">
                                    now playing: {nowPlaying.title}
                                </p>
                            )}
                            <audio
                                id="reactAudioPlayer"
                                src={nowPlaying && nowPlaying.url}
                                controls
                            />
                            <div className="song-controls">
                                <p>group controls: </p>
                                <SongUploader
                                    username={username}
                                    roomID={params.roomID}
                                    socket={socket}
                                />
                                <label className="btn">
                                    <button id="play" onClick={playSong} />
                                    play
                                </label>
                                <label className="btn">
                                    <button id="pause" onClick={pauseSong} />
                                    pause
                                </label>
                            </div>
                        </div>
                        <div className="chat-panel">
                            <div className="chat-box" id="chat-box">
                                {chatMessages.map((message, index) => {
                                    return (
                                        <ChatMessage
                                            key={index}
                                            message={message}
                                        />
                                    );
                                })}
                            </div>
                            <div className="chat-input">
                                <input
                                    id="chatMessageInput"
                                    type="text"
                                    placeholder="enter message..."
                                    onKeyPress={handleKeyPress}
                                />
                                <label className="btn">
                                    <button
                                        id="sendButton"
                                        onClick={sendMessage}
                                    />
                                    send
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Room;
