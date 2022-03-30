const express = require('express');
const router = express.Router();
const qaControl = require('./qa.controller.js');

router.post('/list', qaControl.list);
router.post('/write', qaControl.write);
router.post('/view', qaControl.view);
router.post('/edit', qaControl.edit);
router.post('/delete', qaControl.delete);
router.post('/reply/write', qaControl.replyWrite);
router.post('/reply/update', qaControl.replyUpdate);
router.post('/reply/delete', qaControl.replyDelete);

module.exports = router;
