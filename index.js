const SocketServer = require('ws').Server;

const app = require('./app');

//Start the server
const port = process.env.PORT || 5001;

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

const wss = new SocketServer({ server });
const users = []

const broadcast = (data, ws) => {
	wss.clients.forEach((client) => {
		if (client.readyState === ws.OPEN && client !== ws ) { 
			client.send(JSON.stringify(data))
		}
	})
}

wss.on('connection', ws => {
  let index
  ws.send(JSON.stringify({
    type: "WS_CONNECTED",
    message: "Pong..."
  }));
  ws.on("message", (message) => {
    console.log("Cliente conectados: " + wss.clients.size);
    const data = JSON.parse(message)
    switch (data.type) {
			case 'ADD_USER': {
				index = users.length
				users.push({ name: data.name, id: index + 1})
				ws.send(JSON.stringify({
					type: 'USERS_LIST',
					users
				}))
				broadcast({
					type: 'USERS_LIST',
					users
				}, ws)
				break
			}
			case 'ADD_MESSAGE':
				broadcast({
					type: 'ADD_MESSAGE',
					message: data.message,
					author: data.author
				}, ws)
				break
			default:
        break
    }
  })
});