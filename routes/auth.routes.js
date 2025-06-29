//auth.routes.js
const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.Controller.js");
const updatecontroller = require("../controllers/authupdate.controller.js");
const verify = require("../middlewares/verification.js");
const User = require("../models/user.js");

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept"
  );
  next();
});

// Route for user registration
router.post("/signup", verify.checkDuplicate, controller.signup);


// Login
router.post("/signin", controller.signin);

// Logout
router.post("/signout", controller.signout);

// Profile (protected route)
router.get("/profile", verify.verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    // res.json(user);
    const userObj = user.toObject({ virtuals: true }); // ensure virtuals included
    res.json(userObj);
    
  } catch (err) {
    res.status(500).json({ message: "Error fetching user profile." });
  }
});

router.put('/update-profile', verify.verifyToken, updatecontroller.updateProfile)
router.put('/avatar', verify.verifyToken, updatecontroller.updateAvatar);

module.exports = router;