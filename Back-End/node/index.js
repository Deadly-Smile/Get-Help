const { server, Socket } = require("socket.io");
const io = new server(8080);

io.on("connection", (socket) => {
    console.log(`Socket Connected`, socket.id);
});
