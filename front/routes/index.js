const express = require('express');

const adminRouter = require('./admin/adminRouter.js');
const qaRouter = require('./qa/qaRouter.js');
const chatRouter = require('./chat/chatRouter.js');
const homeRouter = require('./home/homeRouter.js');
const userRouter = require('./user/userRouter.js');

const router = express.Router();
const auth = require('../middlewares/user/auth.js');

router.use('/admin', adminRouter);

router.use('/qa', auth, qaRouter);

router.use('/chat', auth, chatRouter);

router.use('/home', homeRouter);

router.use('/user', userRouter);

module.exports = router;
