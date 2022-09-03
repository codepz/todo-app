import { io } from "socket.io-client";

class SocketioService {
	constructor(socket) {
		socket = this.socket;
	}

	setupSocketConnection() {
		this.socket = io("http://localhost:3000");
		// console.log("socket", this.socket);
		this.socket.on("test", (msg) => console.log("test"));
	}

	disconnect() {
		if (this.socket) {
			this.socket.disconnect();
		}
	}
}

export default SocketioService;
