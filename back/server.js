const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routes/index.js');

const app = express();

const corsOpt = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOpt));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api', router);

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: '*' },
});

// 소켓 분리해야함(?)
const connectCb = (socket) => {
  console.log(socket.id);
  socketList.push(socket);
  console.log(socketList.length, '명 접속');
  console.log(socketList);
  socket.on('message', getMsg);
  socket.on('send', sendMsg);
  socket.on('disconnect', closeCb);
};

io.on('connection', connectCb);
let socketList = [];

const getMsg = (msg) => {
  console.log('message received:', msg);
  io.emit('message', msg);
};

const sendMsg = (msg) => {
  console.log('sent msg:', msg);
  io.emit('send', msg);
};

const closeCb = (socket) => {
  socketList.splice(socketList.indexOf(socket), 1);
  console.log(socketList.length, '명 남음');
};

server.listen(4000);
