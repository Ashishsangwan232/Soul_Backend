const express = require('express');
const router = express.Router();
const auth = require('../middlewares/verification')
const hardDelete =require('../controllers/Harddeletecontroller');


router.patch('/:id/parmanentDeleted', auth.verifyToken,hardDelete.hardDeletePost);

module.exports = router;
