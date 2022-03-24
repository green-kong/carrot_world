const express = require('express');

const adminRouter = require('./admin/adminRouter.js');
const qaRouter = require('./qa/qaRouter.js');

const router = express.Router();

router.use('/admin', adminRouter);

router.use('/qa', qaRouter);

module.exports = router;
