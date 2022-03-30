const express = require('express');

const qaController = require('./qa.controller.js');

const router = express.Router();
const auth = require('../../middlewares/user/auth.js');

router.get('/list', qaController.list);

router.get('/write', auth, qaController.write);

router.get('/view', qaController.view);

router.get('/edit', qaController.edit);

module.exports = router;
