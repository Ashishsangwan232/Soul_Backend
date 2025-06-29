const Comment = require('../models/Comment');
const Post = require('../models/posts');
const User = require('../models/user');

// CREATE a comment
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required.' });
    }

    const user = await User.findById(req.userId);
    const post = await Post.findById(postId);

    if (!user || !post || post.isDeleted || post.archive || post.status !== 'published') {
      return res.status(404).json({ message: 'Post not found or unavailable.' });
    }

    const comment = new Comment({
      postId,
      authorId: user._id,
      authorName: user.username || user.name,
      content
    });

    const savedComment = await comment.save();

    // Optionally push to post.comments array
    await Post.findByIdAndUpdate(postId, { $push: { comments: savedComment._id } });

    res.status(201).json(savedComment);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: 'Internal server error while adding comment.' });
  }
};
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .populate({
        path: 'authorId',
        select: 'username profilePicKey',
      })
      .sort({ createdAt: -1 });

    // Map each comment to plain object with virtuals
    const commentsObj = comments.map(comment =>
      comment.toObject({ virtuals: true })
    );

    res.status(200).json(commentsObj);

  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: 'Error fetching comments for this post.' });
  }
};
