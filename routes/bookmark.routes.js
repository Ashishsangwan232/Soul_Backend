const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmark.controller');
const auth = require('../middlewares/verification'); // For `req.user`

router.get('/bookmarked', auth.verifyToken, bookmarkController.getMyBookmarks);
router.post('/togglebookmark/:postId', auth.verifyToken, bookmarkController.toggleBookmark);

module.exports = router;