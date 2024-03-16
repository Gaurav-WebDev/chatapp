import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = 3000;

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

  socket.on('chat message', (msg) => {
    if (socket.nickname) {
      const messageWithNickname = `${socket.nickname}: ${msg}`;
      io.emit('chat message', messageWithNickname);
    }
  });

  socket.on('disconnect', () => {
    if (socket.nickname) {
      io.emit('userLeft', `${socket.nickname} has left the chat`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
