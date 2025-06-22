const express = require('express');
const router = express.Router();
const postControl = require('../controllers/post.controller');
const auth = require('../middlewares/verification'); // Adjust if needed

// CREATE post (draft or publish)
router.post('/post', auth.verifyToken, postControl.post);

// GET all published & active posts
router.get('/getAll', postControl.getAllPosts);

// GET posts created by the logged-in user
router.get('/me', auth.verifyToken, postControl.userPosts);
router.get('/me/archived', auth.verifyToken, postControl.userPostsArchived);

// GET single post by ID
router.get('/:id', postControl.getSinglePost);

// EDIT post (by owner only)
router.patch('/:id', auth.verifyToken, postControl.updatePost);

// TOGGLE archive

router.patch('/toggle-archive/:id', auth.verifyToken, postControl.toggleArchive);

router.patch('/:id/soft-delete', auth.verifyToken, postControl.softDeletePost);
router.get('/me/Deleted', auth.verifyToken, postControl.userPostsdeleted);

module.exports = router;




// const express = require('express');
// const router = express.Router();
// const postcontrol = require('../controllers/post.controller');
// const auth = require('../middlewares/verification'); // Ensure path is correct

// // POST a new post
// router.post('/post', auth.verifyToken, postcontrol.post);

// // GET all posts
// router.get('/getAllposts', postcontrol.getAllPosts); // Changed to GET

// // GET /api/posts/user
// router.get('/user', auth.verifyToken, postcontrol.Userposts);

// module.exports = router;
