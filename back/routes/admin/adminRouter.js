require('dotenv').config();

const express = require('express');

const router = express.Router();

const adminControll = require('./admin.controller.js');

router.post('/login', adminControll.login);

router.post('/auth', adminControll.auth);

router.post('/sell', adminControll.sell);

router.post('/auction', adminControll.auction);

router.post('/user', adminControll.user);

router.post('/qa', adminControll.qa);

router.post('/qaDel', adminControll.qaDel);

router.post('/auDel', adminControll.auDel);

router.post('/sellDel', adminControll.sellDel);

router.post('/userDel', adminControll.userDel);

router.post('/userProfile', adminControll.userProfile);

router.post('/createCat', adminControll.createCat);

router.post('/delCat', adminControll.delCat);

router.post('/editCat', adminControll.editCat);

router.post('/changeCat', adminControll.changeCat);

router.post('/userEdit', adminControll.userEdit);

module.exports = router;
