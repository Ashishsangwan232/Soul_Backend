const express = require('express');
const router = express.Router();
const { countPostsByUser } = require('../controllers/counttotalpost.controller');
const auth= require('../middlewares/verification'); 

router.get('/posts/count', auth.verifyToken, countPostsByUser);

module.exports = router;