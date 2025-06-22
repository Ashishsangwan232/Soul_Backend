const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likes.controller');
const auth = require('../middlewares/verification'); // Your authentication middleware

router.post('/toggle', auth.verifyToken, likeController.toggleLike);

router.get('/:targetType/:targetId', likeController.getLikesForTarget);

router.get('/status/:targetType/:targetId',auth.verifyToken, likeController.checkUserLikeStatus);


module.exports = router;
