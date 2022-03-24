const express = require('express');

const qaController = require('./qa.controller.js');

const router = express.Router();

router.get('/list', qaController.list);

router.get('/write', qaController.write);

module.exports = router;
