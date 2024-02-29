const express = require("express");
const socket = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const { join } = require("path");

const app = express();
app.use('/admin', express.static('./node_modules/@socket.io/admin-ui/ui/dist'));
app.use('/',(req, res) => {
    res.sendFile(join(__dirname, '/test.html'));
});

const PORT = 8080;
const server = app.listen(PORT, () => console.log(`server is listening on ${PORT}`));

const io = socket(server, {
    cors: {
        origin: "*"
    }
});

instrument(io, {
    auth: false,
    mode: "development",
});

io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);
    socket.onAny((event, ...args) => {
        console.log(event, args);
        socket.emit("hello", { "message": "hello" })
    });
    socket.on("disconnect", (reason) => {
        console.log(`${socket.id} disconnected (${reason})`);
    });
});