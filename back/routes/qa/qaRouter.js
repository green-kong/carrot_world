const express = require('express');
const router = express.Router();
const qaControl = require('./qa.controller.js');

router.post('/write', qaControl.write);
router.post('/view', qaControl.view);
router.post('/list', qaControl.list);
router.post('/delete', qaControl.delete);
router.post('/edit', qaControl.edit);
router.post('/editPost', qaControl.editPost);
router.post('/reply/write', qaControl.replyWrite);
router.post('/reply/update', qaControl.replyUpdate);
router.post('/reply/delete', qaControl.replyDelete);

module.exports = router;
