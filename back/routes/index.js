const express = require('express');

const router = express.Router();

const homeRouter = require('./home/homeRouter.js');

router.use('/home', homeRouter);

module.exports = router;
