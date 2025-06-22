const express = require('express');
const commentController = require('../controllers/comment.controller');
const router = express.Router();
const postControl = require('../controllers/post.controller');
const auth = require('../middlewares/verification'); // Adjust if needed

// POST a comment
router.post('/:postId', auth.verifyToken, commentController.addComment);

// GET all comments for a post
router.get('/:postId', commentController.getCommentsByPost);

module.exports = router;