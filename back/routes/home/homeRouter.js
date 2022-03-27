const express = require('express');

const { upload } = require('../../utils/multer/multer.js');

const homeControll = require('./home.controller.js');

const router = express.Router();

router.post('/', homeControll.main);

router.post('/write', upload.array('productImg'), homeControll.write);

router.post('/list', homeControll.list);

module.exports = router;
