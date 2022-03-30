const express = require('express');

const router = express.Router();

const homeRouter = require('./home/homeRouter.js');

const userRouter = require('./user/userRouter.js');

const qaRouter = require('./qa/qaRouter.js');

router.use('/home', homeRouter);

router.use('/user', userRouter);

router.use('/qa', qaRouter);

module.exports = router;
