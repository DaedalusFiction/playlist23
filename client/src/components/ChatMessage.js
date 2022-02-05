const ChatMessage = ({ message }) => {
    return (
        <div className="chat-message">
            <div className="chat-message-info">
                <p>{message.user}</p>
                <p>{message.time}</p>
            </div>
            <p>{message.message}</p>
        </div>
    );
};

export default ChatMessage;
