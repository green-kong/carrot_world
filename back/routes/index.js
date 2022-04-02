const express = require('express');

const router = express.Router();

const homeRouter = require('./home/homeRouter.js');

const userRouter = require('./user/userRouter.js');

const statisticsRouter = require('./statistics/statistics.js');

router.use('/home', homeRouter);

router.use('/user', userRouter);

router.use('/statistics', statisticsRouter);

module.exports = router;
