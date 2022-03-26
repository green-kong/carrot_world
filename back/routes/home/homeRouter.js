const express = require('express');

const { upload } = require('../../utils/multer/multer.js');

const homeControll = require('./home.controller.js');

const router = express.Router();

router.post('/write', upload.array('productImg'), homeControll.write);

module.exports = router;