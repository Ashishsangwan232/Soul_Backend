const User = require('../models/user');
const Post = require('../models/posts');

exports.userprofile = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Get basic details
        // console.log(userId);
        const user = await User.findById(userId).select('username email profilePicKey');

        if (!user) return res.status(404).json({ message: 'User not found' });
        // console.log(userId);
        // Get additional stats
        const posts = await Post.find({ authorId: userId });
        const postCount = posts.length;
        // const totalLikes = posts.reduce((acc, post) => acc + post.likes.length, 0);
        const userObj = user.toObject({ virtuals: true });

        res.json({
            username: userObj.username,
            // email: userObj.email,
            profilePicture: userObj.profilePic,
            postCount,
            // totalLikes,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};