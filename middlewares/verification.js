
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const checkDuplicate = async (req, res, next) => {
    //checking duplicate email
    try {
        const { username, email } = req.body;
        // console.log("----------------------BODY:------------------------------------", req.body);
        if (!username || !email) {
            return res.status(400).json({ message: "Email and username are required." });
        }
        const existingEmail = await User.findOne({
            email: { $regex: new RegExp(`^${email}$`, "i") }
        });
        if (existingEmail) {
            return res.status(400).json({ message: "Failed! Email is already in use!" });
        }

        next(); // No duplicates, proceed
    } catch (error) {
        console.error("Error checking duplicates:", error);
        return res.status(500).json({ message: "Internal server error while checking duplicates." });
    }
};


const verifyToken = (req, res, next) => {

    // const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
    let token = req.cookies.token;

    if (!token && req.headers["authorization"]) {
        const authHeader = req.headers["authorization"];
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
    }

    if (!token) return res.status(401).json({ message: "Access denied. No token." });

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT_SECRET is not defined in environment variables.");
            return res.status(500).json({ message: "Server configuration error." });
        }
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.id;
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verification error:", err.message);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token." });
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired." });
        }
        return res.status(403).json({ message: "Forbidden. Token issue." });
    }
};

const verify = {
    checkDuplicate,
    verifyToken,
};


module.exports = verify;
