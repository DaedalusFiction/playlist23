import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

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

    useEffect(() => {
        const ENDPOINT = "http://localhost:4001";
        const newSocket = socketIOClient.connect(ENDPOINT);

        newSocket.on("message", (message) => {});
    }, []);

    useEffect(() => {}, [chatMessages]);

    const sendMessage = () => {
        const newMessage = {
            time: new Date().getTime(),
            room: params.roomID,
            user: "dave",
            message: "hi",
        };
        setChatMessages([...chatMessages, newMessage]);
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
            />
            <button onClick={sendMessage}>Send</button>
        </>
    );
};

export default Room;
