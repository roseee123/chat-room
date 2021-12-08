import * as express from 'express';
import * as http from "http";
import * as socketio from "socket.io";
import { Message } from "./interface/message";
import * as mongoose from 'mongoose';

import { addUser, removeUser, getUsers } from "./user";

const DB_CONNECT = 'mongodb://localhost:27017/chat-room';

const app = express();
const httpServer = http.createServer(app);
const io = new socketio.Server(httpServer, {
    cors: {
        origin: '*',
    }
});

const messagesSchema = new mongoose.Schema<Message>(
    {
        User: String,
        Content: String,
        SendTime: Date
    }
);
const MessageModel = mongoose.model<Message>('Message', messagesSchema);

mongoose.connect(DB_CONNECT);

io.on('connection', (socket) => {
    const username = socket.handshake.query['User'];
    addUser(username, socket.id);
    io.emit("userList", getUsers());

    socket.on("disconnect", () => {
        removeUser(username, socket.id);
        let users = getUsers();
        io.emit("userList", users);
    });

    socket.on("sendMessage", (m: Message) => {
        io.emit("message", m);
        const newMessage = new MessageModel(m);
        newMessage.save();
    });
});

httpServer.listen(8080);