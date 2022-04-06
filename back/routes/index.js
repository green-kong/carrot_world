const express = require('express');

const router = express.Router();

const homeRouter = require('./home/homeRouter.js');

const userRouter = require('./user/userRouter.js');

const statisticsRouter = require('./statistics/statistics.js');

const qaRouter = require('./qa/qaRouter.js');

const adminRouter = require('./admin/adminRouter.js');

const chatRouter = require('./chat/chatRouter.js');

const authRouter = require('./auth/auth.js');

router.use('/home', homeRouter);

router.use('/user', userRouter);

router.use('/statistics', statisticsRouter);

router.use('/qa', qaRouter);

router.use('/admin', adminRouter);

router.use('/chat', chatRouter);

router.use('/auth', authRouter);

module.exports = router;
