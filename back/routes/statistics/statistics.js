const express = require('express');

const statControll = require('./stat.controller.js');

const router = express.Router();

router.post('/graph', statControll.graph);

module.exports = router;
