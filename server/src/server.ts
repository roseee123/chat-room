import * as express from 'express';
import * as http from "http";
import * as socketio from "socket.io";
import { Message } from "./message";
import { Schema, model,  connect } from 'mongoose';
const DB_CONNECT = 'mongodb://localhost:27017/chat-room';

const app = express();
const httpServer = http.createServer();
const io = new socketio.Server(httpServer, {
    cors: {
        origin: '*',
    }
});

const messagesSchema = new Schema<Message>(
    {
        User: String,
        Content: String,
        SendTime: Date
    }
);
const MessageModel = model<Message>('Message',messagesSchema);

app.get('/', (request, response) => {
    response.send('Hello world!');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    //io.emit("message", 'Hello wWrld!');

    socket.on("disconnect", () => {
        console.log("a user go out");
    });

    socket.on("sendMessage", (m: Message) => {
        console.log("[server](message): %s", JSON.stringify(m));
        io.emit("message", m);
        const newMessage = new MessageModel(m);
        newMessage.save();
    });

});

connect(DB_CONNECT);

httpServer.listen(8080);