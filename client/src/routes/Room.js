import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import socketIOClient from "socket.io-client";
import ReactAudioPlayer from "react-audio-player";
import ReactDOM from "react-dom";
import moment from "moment";
import "moment-timezone";
import ChatMessage from "../components/ChatMessage";
import SongBox from "../components/SongBox";
import SongUploader from "../components/SongUploader";
import { collection, getDoc, getDocs, doc } from "firebase/firestore";

const Room = ({ username }) => {
    const [userName, setUsername] = useState(username);
    const params = useParams();
    const ENDPOINT = "http://localhost:4001";
    //socket create as useState element and initialized so that it won't create a new connection every time page rerenders
    const [socket, setSocket] = useState(socketIOClient.connect(ENDPOINT));

    const [chatMessages, setChatMessages] = useState([
        //welcome message
        {
            time: moment().format("h:mm a"),
            key: Date.now(),
            room: params.roomID,
            user: userName,
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
        return () => {
            //clean up listeners
            socket.removeAllListeners();
        };
    }, [chatMessages, socket]);

    const sendMessage = () => {
        const msg = document.getElementById("chatMessageInput").value;
        if (msg !== "") {
            const newMessage = {
                time: moment().format("h:mm a"),
                key: Date.now(),
                room: params.roomID,
                user: userName,
                message: msg,
            };

            socket.emit("sendMessage", newMessage);

            document.getElementById("chatMessageInput").value = "";
        }
    };

    const handleKeyPress = (e) => {
        if (e.code === "Enter") {
            sendMessage();
        }
    };

    const selectSong = (e) => {
        console.log(songs[e.target.id].url);
        setNowPlaying(songs[e.target.id].url);
    };

    return (
        <>
            <div className="room">
                <div className="container">
                    <div className="song-panel">
                        <div className="control-panel">
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
                        <div className="song-controls">
                            <SongUploader
                                username={username}
                                roomID={params.roomID}
                                socket={socket}
                            />
                            <ReactAudioPlayer
                                className="audio-player"
                                src={nowPlaying}
                                autoplay
                                controls
                            />
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
                                placeholder="Enter Message"
                                onKeyPress={handleKeyPress}
                            />
                            <label className="btn">
                                <button id="sendButton" onClick={sendMessage} />
                                Send
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Room;
