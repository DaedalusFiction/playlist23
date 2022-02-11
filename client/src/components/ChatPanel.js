import moment from "moment";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket/socket";
import ChatMessage from "./ChatMessage";

const ChatPanel = ({ username }) => {
    const [chatMessages, setChatMessages] = useState([]);

    const params = useParams();

    useEffect(() => {
        socket.on("chatMessage", (message) => {
            setChatMessages([...chatMessages, message]);
            let chatbox = document.getElementById("chat-box");
            chatbox.scrollTop = chatbox.scrollHeight;
        });

        return () => {
            // //clean up listeners
            socket.off("chatMessage");
        };
    }, [chatMessages, params.roomID]);

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

    const handleKeyPress = (e) => {
        if (e.code === "Enter" && e.target.id === "chatMessageInput") {
            sendMessage();
        } else if (e.code === "Enter" && e.target.id === "usernameInput") {
            document.getElementById("chatMessageInput").focus();
        }
    };
    return (
        <div>
            <div className="chat-panel">
                <div className="chat-box" id="chat-box">
                    {chatMessages.map((message, index) => {
                        return <ChatMessage key={index} message={message} />;
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
                        <button id="sendButton" onClick={sendMessage} />
                        send
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;
