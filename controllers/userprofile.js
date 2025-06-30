const User = require('../models/user');
const Post = require('../models/posts');
const Like =require('../models/Likes');

exports.userprofile = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId).select('username profilePicKey');

        if (!user) return res.status(404).json({ message: 'User not found' });

        const posts = await Post.find({ authorId: userId });
        const postCount = posts.length;

        // Extract Post IDs
        const postIds = posts.map(post => post._id);

        // Count likes from Like model where targetId in user's posts
        const totalLikes = await Like.countDocuments({
            targetId: { $in: postIds },
            targetType: 'Post'
        });

        const userObj = user.toObject({ virtuals: true });

        res.json({
            username: userObj.username,
            // email: userObj.email,
            profilePicture: userObj.profilePic,
            postCount,
            totalLikes,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};