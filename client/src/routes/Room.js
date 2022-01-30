import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:4001";
const socket = socketIOClient.connect(ENDPOINT);

socket.on("chatMessage", (chatMessage) => {
    console.log(chatMessage);
});

const Room = ({ username }) => {
    const params = useParams();

    const [chatMessages, setChatMessages] = useState([
        {
            time: new Date().getTime(),
            room: params.roomID,
            user: "dave",
            message: "hi",
        },
    ]);

    useEffect(() => {}, []);

    const sendMessage = () => {
        const newMessage = {
            time: new Date().getTime(),
            room: params.roomID,
            user: "dave",
            message: document.getElementById("chatMessageInput").value,
        };
        setChatMessages([...chatMessages, newMessage]);
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
