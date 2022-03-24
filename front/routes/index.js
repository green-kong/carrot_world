const express = require('express');

const adminRouter = require('./admin/adminRouter.js');

const router = express.Router();

router.use('/admin', adminRouter);

module.exports = router;
