import { boot } from "quasar/wrappers";
import VueSocketIO from "vue-3-socket.io";
import { io } from "socket.io-client";
const socket = io("https://cp-todo-app.herokuapp.com");

export default boot(async ({ app, router, store }) => {
	await app.use(
		new VueSocketIO({
			debug: true,
			connection: socket,
			vuex: {
				store,
				actionPrefix: "SOCKET_",
				mutationPrefix: "SOCKET_",
			},
		})
	);
});
