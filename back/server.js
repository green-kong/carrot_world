const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');

const app = express();

const corsOpt = {
  origin: true,
  credentials: true,
};

const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: { origin: '*' },
});

const router = require('./routes/index.js');
require('./bidSocket.js')(io);

app.use(cors(corsOpt));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api', router);

server.listen(4000);
