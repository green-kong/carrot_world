const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { Server } = require('socket.io');

const router = require('./routes/index.js');

const app = express();

const corsOpt = {
  origin: true,
  credentials: true,
};

const http = createServer();
const io = new Server(http, {
  cors: corsOpt,
});

io.on('connection', (socket) => {
  console.log('연결?');

  socket.on('auction', (req) => {
    io.emit('auctionSrv', { ...req });
  });
});

app.use(cors(corsOpt));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

http.listen(4000);
