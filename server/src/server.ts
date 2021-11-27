import * as express from 'express';
import * as http from "http";
import * as socketio from "socket.io";

const app = express();
const httpServer = http.createServer();
const io = new socketio.Server(httpServer, {
    cors: {
        origin: '*',
    }
});

app.get('/', (request, response) => {
    response.send('Hello world!');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    io.emit("message", 'Hello wWrld!');

    socket.on("disconnect", () => {
        console.log("a user go out");
    });

    socket.on("sendMessage", (obj) => {
        io.emit("message", obj);
    });

});

httpServer.listen(8080);