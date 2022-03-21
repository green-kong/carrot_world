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

app.use(router);

app.listen(4001);
