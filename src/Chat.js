import { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { FaPaperPlane } from 'react-icons/fa';

function Chat({socket, username, room}) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date().toLocaleTimeString('en-US', {hour: 'numeric', hour12: true, minute:'2-digit'}),
            };
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        const handleReceiveMessage = (data) => {
            setMessageList((list) => [...list, data]);
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [socket]);

    return (
            <div className="chat-window">
                <div className="chat-header">
                    <p>Simple Chat App</p>
                </div>
                <div className="chat-body">
                    <ScrollToBottom className='message-container'>
                        {messageList.map((messageContent) => {
                            return <div className="message" id={username === messageContent.author ? "you" : "other"}>
                                <div>
                                    <div className="message-content">
                                        <p>
                                            {messageContent.message}
                                        </p>
                                    </div>
                                    <div className="message-meta">
                                            
                                        <p id="time">{messageContent.time}</p>
                                        <p id="author" title={messageContent.author}>{messageContent.author}</p>
                                    </div>
                                </div>
                            </div>
                        })}
                    </ScrollToBottom>
                </div>
                <div className="chat-footer">
                    <input
                        type="text"
                        value={currentMessage}
                        placeholder="Type your message"
                        onChange={(event) => {
                            setCurrentMessage(event.target.value);
                        }}
                        onKeyUp={(event) => event.key === "Enter" && sendMessage()}
                    />
                    <button onClick={sendMessage}><FaPaperPlane /></button>
                </div>
            </div>
    );
}

export default Chat