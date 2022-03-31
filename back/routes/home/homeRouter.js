const express = require('express');

const { upload } = require('../../utils/multer/multer.js');

const homeControll = require('./home.controller.js');

const router = express.Router();

router.post('/', homeControll.main);

router.post('/write', upload.array('productImg'), homeControll.write);

router.post('/list', homeControll.list);

router.post('/search', homeControll.search);

router.post('/view', homeControll.view);

router.post('/tag', homeControll.tag);

router.post('/like', homeControll.like);

module.exports = router;
