const express = require('express');

const router = express.Router();

const homeRouter = require('./home/homeRouter.js');

const userRouter = require('./user/userRouter.js');

router.use('/home', homeRouter);

router.use('/user', userRouter);

module.exports = router;
