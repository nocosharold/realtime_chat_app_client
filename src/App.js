import "./App.css"
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
	const [username, setUsername] = useState("");
	const [room, setRoom] = useState("");
	const [showChat, setShowChat] = useState(false);

	const joinRoom = () => {
		if(username !== "" && room !== "") {
			socket.emit("join_room", room);
			setShowChat(true);
		}
	};

	return (
		<div className="App">
			{!showChat ? (
			<div className="joinChatContainer">
				<h3>Welcome aboard! Let's chat!</h3>
				<h4>Please provide your name and room ID to begin.</h4>
				<label htmlFor="username">Your Name</label>
				<input
					type="text"
					name="username"
					placeholder="e.g. John Doe"
					onChange={(event) => {
						setUsername(event.target.value);
					}}
				/>
				<label htmlFor="room_id">Room ID</label>
				<input
					type="text"
					name="room_id"
					placeholder="e.g. 123"
					onChange={(event) => {
						setRoom(event.target.value);
					}}
				/>
				<button onClick={joinRoom}>Join the room!</button>
			</div>
			)
			:  (
			<Chat socket={socket} username={username} room={room} />
			)}
		</div>
	);
}

export default App;
