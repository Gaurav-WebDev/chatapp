import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);


const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 3000;

let userNickname = "";

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('setNickname', (nickname) => {
    socket.nickname = nickname; 
    userNickname = nickname;
    io.emit('userJoined', `${nickname} has joined the chat`);
  });

  socket.on('disconnect', () => {
    if (socket.nickname) {
      io.emit('userLeft', `${socket.nickname} has left the chat`);
    }
  });
});


io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log( "message : " + msg);
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(PORT, () => {
  console.log('server running at http://localhost:1234');
});