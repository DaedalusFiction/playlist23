import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import moment from "moment";
import "moment-timezone";

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

    useEffect(() => {
        socket.emit("joinRoom", params.roomID);
    }, [params.roomID, socket]);

    useEffect(() => {
        //add listener for new chat messages, updates messages
        socket.on("chatMessage", (message) => {
            setChatMessages([...chatMessages, message]);
        });
        return () => {
            //clean up listeners
            socket.removeAllListeners();
        };
    }, [chatMessages, socket]);

    const sendMessage = () => {
        const newMessage = {
            time: moment().format("h:mm a"),
            key: Date.now(),
            room: params.roomID,
            user: userName,
            message: document.getElementById("chatMessageInput").value,
        };

        socket.emit("sendMessage", newMessage);

        document.getElementById("chatMessageInput").value = "";
    };

    const handleKeyPress = (e) => {
        if (e.code === "Enter") {
            sendMessage();
        }
    };

    return (
        <>
            <div>Music Room: {params.roomID}</div>
            <p>username: {username}</p>
            <div id="chatMessages">
                {chatMessages &&
                    chatMessages.map((chatMessage, index) => {
                        return (
                            <p key={chatMessage.key}>
                                {chatMessage.room}
                                {chatMessage.user}
                                {chatMessage.message}
                                {chatMessage.time}
                            </p>
                        );
                    })}
            </div>

            <input
                id="chatMessageInput"
                type="text"
                placeholder="Enter Message"
                onKeyPress={handleKeyPress}
            />
            <button id="sendButton" onClick={sendMessage}>
                Send
            </button>
        </>
    );
};

export default Room;
