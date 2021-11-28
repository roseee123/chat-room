import * as express from 'express';
import * as http from "http";
import * as socketio from "socket.io";
import { Message } from "./message";
import { Schema, model, connect } from 'mongoose';

const DB_CONNECT = 'mongodb://localhost:27017/chat-room';
const USER = 'Rosa';
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
const MessageModel = model<Message>('Message', messagesSchema);

app.get('/', (request, response) => {
    response.send('Hello world!');
});

const users = [];

io.on('connection', (socket) => {
    console.log('a user connected');
    addUser(USER, socket.id);

    //io.emit("message", 'Hello wWrld!');

    socket.on("disconnect", () => {
        console.log("a user go out");
        removeUser(USER, socket.id);
    });

    socket.on("sendMessage", (m: Message) => {
        console.log("[server](message): %s", JSON.stringify(m));
        io.emit("message", m);
        const newMessage = new MessageModel(m);
        newMessage.save();
    });
    io.emit("userList", users);
});

function addUser(username, id) {
    const user = { id, username };
    users.push(user);

    console.log(`addUser`);
    for (let user of users) {
        console.log(`${user.id}-${user.username}`);
    }
}

function removeUser(userName, id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        users.splice(index, 1)[0];
    }
    console.log(`removeUser`);
    for (let user of users) {
        console.log(`${user.id}-${user.username}`);
    }
}

connect(DB_CONNECT);

httpServer.listen(8080);