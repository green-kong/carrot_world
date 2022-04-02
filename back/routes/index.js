const express = require('express');

const router = express.Router();

const homeRouter = require('./home/homeRouter.js');

const userRouter = require('./user/userRouter.js');

const adminRouter = require('./admin/adminRouter.js');

router.use('/home', homeRouter);

router.use('/user', userRouter);

router.use('/admin', adminRouter);

module.exports = router;
