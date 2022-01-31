import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import moment from "moment";
import "moment-timezone";
const ENDPOINT = "http://localhost:4001";
const socket = socketIOClient.connect(ENDPOINT);

const Room = ({ username }) => {
    const params = useParams();

    const [chatMessages, setChatMessages] = useState([
        {
            time: moment().format("h:mm a"),
            room: params.roomID,
            user: username,
            message: `Welcome to room: ${params.roomID}`,
        },
    ]);

    useEffect(() => {
        socket.on("chatMessage", (chatMessage) => {
            setChatMessages([...chatMessages, chatMessage]);
        });
    }, [chatMessages]);

    const sendMessage = () => {
        const newMessage = {
            time: moment().format("h:mm a"),
            room: params.roomID,
            user: username,
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
                            <p key={chatMessage.time}>
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
