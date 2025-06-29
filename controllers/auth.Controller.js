const User = require('../models/user');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendVerificationEmail = require('../utils/sendVerificationEmail'); // make sure to create this file

const jwtSecret = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // console.log("Signup hit:", req.body);

        let existingUser = await User.findOne({
            email: { $regex: new RegExp(`^${email}$`, 'i') }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Failed! email is already in use!" });
        }

        if (existingUser && !existingUser.verified) {
            return res.status(400).json({
                message: "Account already exists but is not verified. Please check your email or request a new link."
            });
        }

        // Generate email verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");


        // Create new user
        const user = new User({
            username,
            email,
            password: bcrypt.hashSync(password, 8),
            verified: false,
            verificationToken
        });

        user.verificationToken = verificationToken;
        user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await user.save();

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({
            message: "User registered successfully! Please check your email to verify your account."
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: error.message });
    }
};


// for handle login 
exports.signin = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        // console.log("Signin hit:", req.body);

        const user = await User.findOne({
            email: { $regex: new RegExp(`^${email}$`, 'i') }
        });

        if (!user) {
            return res.status(404).json({ message: "User Not found." });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: "Invalid Password!" });
        }

        if (!user.verified) {
            return res.status(403).json({ message: "Please verify your email before logging in." });
        }

        const token = jwt.sign({ id: user.id }, jwtSecret, {
            expiresIn: rememberMe ? "7d" : "1d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
        });

        const userObj = user.toObject({ virtuals: true });
        delete userObj.password;

        res.status(200).json({
            message: "Login successful",
            user: userObj
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// for logout 
exports.signout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,         // Must match the original cookie options
            sameSite: "None"
            // domain: 'yourdomain.com'  // Optional: If you set domain during login, add here too
        });
        return res.status(200).json({ message: "You've been signed out" });
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
};