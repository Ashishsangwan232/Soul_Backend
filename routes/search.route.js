const express = require('express');
const router = express.Router();
const { searchPosts } = require('../controllers/search.controller');

router.get('/search', searchPosts);

module.exports = router;
