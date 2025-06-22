const Post = require('../models/posts');
const User = require('../models/user');
const Likes = require('../models/Likes');
const Commet = require('../models/Comment');
const Bookmark = require('../models/bookmark');

// HARD DELETE POST (permanent, only by author)
exports.hardDeletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const userId = req.user.id;
        if (post.authorId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own posts.' });
        }

        
        // 3. Delete associated likes
        await Likes.deleteMany({ targetId: postId, targetType: 'Post' });
        
        // 4. Delete associated comments
        await Commet.deleteMany({ postId: postId });
        
        // 5. Remove post from all user's bookmarks
        // await User.updateMany({}, { $pull: { bookmarks: postId } });
        await Bookmark.deleteMany({ post: postId });
        
        // 1. Delete the post
        await Post.deleteOne({ _id: postId });

        // 2. Remove post ID from user's posts list (if you have such field)
        await User.findByIdAndUpdate(post.authorId, { $pull: { posts: postId } });

        res.status(200).json({ message: 'Post permanently deleted with all associated data.' });

    } catch (err) {
        console.error("Error hard deleting post:", err);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid post ID format.' });
        }
        res.status(500).json({ message: 'Internal server error while permanently deleting the post.' });
    }
};
