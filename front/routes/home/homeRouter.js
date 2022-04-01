const express = require('express');
const auth = require('../../middlewares/user/auth.js');
const homeControll = require('./home.controller.js');

const router = express.Router();

router.use(auth);

router.get('/', homeControll.home);

router.get('/write', homeControll.write);

router.get('/auction', homeControll.auction);

module.exports = router;
