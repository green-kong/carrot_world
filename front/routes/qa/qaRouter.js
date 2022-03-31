const express = require('express');

const qaController = require('./qa.controller.js');
const router = express.Router();

router.get('/list', qaController.list);

router.get('/write', qaController.write);

router.get('/view', qaController.view);

router.get('/delete', qaController.delete);

router.get('/edit', qaController.edit);

module.exports = router;
