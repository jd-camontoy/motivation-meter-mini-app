import adapter from '@sveltejs/adapter-node';
import { Server } from 'socket.io'

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server) {
		const io = new Server(server.httpServer)

		io.on('connection', (socket) => {
			let socketId = socket.id;
			socket.emit('eventFromServer', `(Socket ID: ${socketId}) WebSocket (dev) running...`)

			socket.on('invokeDashboardReload', (arg) => {
				console.log('Received on server', arg);
				socket.broadcast.emit('reloadDashboard', arg);
			})
		});
	},
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		vite: {
			plugins: [webSocketServer],
		},
	}
};

export default config;
