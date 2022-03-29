const express = require('express');

const router = express.Router();

const homeRouter = require('./home/homeRouter.js');
const chatRouter = require('./chat/chatRouter.js');

router.use('/home', homeRouter);
router.use('/chat', chatRouter);

module.exports = router;
