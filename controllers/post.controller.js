const Post = require('../models/posts');
const User = require('../models/user');
const sendNotification = require('../firebase/sendNotification');
// It's highly recommended to add input validation (e.g., using Joi or express-validator)
// as middleware before these controller functions are called.

// CREATE POST (draft or publish)
exports.post = async (req, res) => {
  try {
    const { title, content, category, status } = req.body;

    // Basic input validation (consider more robust validation)
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const foundUser = await User.findById(req.userId);

    if (!foundUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const newPost = new Post({
      title,
      content,
      category,
      status: status || 'published',
      authorId: foundUser._id,
      // authorName: foundUser.username || foundUser.name // Denormalized for read performance
    });

    const savedPost = await newPost.save();

    // Atomically add the post ID to the user's posts array
    await User.findByIdAndUpdate(foundUser._id, { $push: { posts: savedPost._id } });

    if ((status || 'published') === 'published') {
      const otherUsers = await User.find({
        _id: { $ne: foundUser._id },
        fcmToken: { $ne: null }
      });

      for (const user of otherUsers) {
        try {
          await sendNotification(
            user.fcmToken,
            `New Post by ${foundUser.username || foundUser.name}`,
            title
          );

          res.status(201).json({ ...savedPost._doc, id: savedPost._id });
        } catch (err) {
          console.warn(`Failed to notify ${user.username}:`, err.message);
        }
      }
    }
    // res.status(201).json(savedPost);
    res.status(201).json({ ...savedPost._doc, id: savedPost._id });
    
    notifyUsers(savedPost).catch(err => console.error('Notification error:', err));
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: 'An internal server error occurred while creating the post.' });
  }
};

// GET ALL PUBLISHED POSTS (not deleted or archived)
// Consider implementing pagination for large datasets
exports.getAllPosts = async (req, res) => {
  try {
    // Example pagination query params: req.query.page, req.query.limit
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10;
    // const skip = (page - 1) * limit;

    const posts = await Post.find({
      status: 'published',
      isDeleted: false,
      archive: false
    })
      .sort({ createdAt: -1 })
      .populate('authorId', 'username')
    // .skip(skip) // For pagination
    // .limit(limit); // For pagination

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching all posts:", err);
    res.status(500).json({ message: "An internal server error occurred while fetching posts." });
  }
};

// GET LOGGED-IN USER'S POSTS
// Consider implementing pagination
exports.userPosts = async (req, res) => {
  try {
    const userPosts = await Post.find({
      authorId: req.userId,
      isDeleted: false, // Shows both published and draft posts, but not deleted ones
      archive: false
    }).sort({ createdAt: -1 }).populate('authorId', 'username');

    res.status(200).json(userPosts);
  } catch (err) {
    console.error("Error retrieving user's posts:", err);
    res.status(500).json({ message: "An internal server error occurred while retrieving user's posts." });
  }
};
exports.userPostsArchived = async (req, res) => {
  try {
    const userPostsArchived = await Post.find({
      authorId: req.userId,
      isDeleted: false, // Shows both published and draft posts, but not deleted ones
      archive: true
    }).sort({ createdAt: -1 }).populate('authorId', 'username');

    res.status(200).json(userPostsArchived);
  } catch (err) {
    console.error("Error retrieving user's posts:", err);
    res.status(500).json({ message: "An internal server error occurred while retrieving user's posts." });
  }
};


// GET SINGLE POST (public view - only published, not deleted, not archived)
exports.getSinglePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      isDeleted: false,
      archive: false,
      // status: 'published'
    }).populate('authorId', 'username');


    if (!post) {
      return res.status(404).json({ message: 'Post not found or not available.' });
    }
    res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching single post:", err);
    if (err.name === 'CastError') { // Handle invalid ObjectId format
      return res.status(400).json({ message: 'Invalid post ID format.' });
    }
    res.status(500).json({ message: "An internal server error occurred while fetching the post." });
  }
};
// TOGGLE ARCHIVE STATUS OF A POST
exports.toggleArchive = async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post
    const post = await Post.findOne({
      _id: postId,
      authorId: req.userId, // Ensure only the author can toggle
      isDeleted: false
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or not accessible.' });
    }
    if (post.status === 'draft') {
      console.log({ message: 'Draft posts cannot be archived or unarchived.' });
      return res.status(400).json({ message: 'Draft posts cannot be archived or unarchived.' });
    }

    // Toggle the archive flag
    post.archive = !post.archive;
    const updatedPost = await post.save();

    res.status(200).json({
      message: `Post has been ${post.archive ? 'archived' : 'unarchived'}.`,
      post: updatedPost
    });

  } catch (err) {
    console.error("Error toggling archive:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid post ID format.' });
    }
    res.status(500).json({ message: 'An internal server error occurred while toggling archive.' });
  }
};
exports.updatePost = async (req, res) => {
  try {
    console.log("REQ.BODY:", req.body);
    console.log("REQ.PARAMS:", req.params);
    const { title, content, category, status } = req.body;

    // Validate at least one field is provided
    if (!title && !content && !category && !status) {
      return res.status(400).json({ message: 'No update fields provided.' });
    }

    const post = await Post.findOne({
      _id: req.params.id,
      authorId: req.userId,
      isDeleted: false
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or access denied.' });
    }

    // Prevent updates on archived posts
    if (post.archive) {
      return res.status(400).json({ message: 'Cannot update an archived post. Unarchive it first.' });
    }

    // Apply updates if provided
    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (status) post.status = status;

    post.updatedAt = Date.now(); // Optional if using timestamps

    const updatedPost = await post.save();

    res.json({ message: 'Post updated successfully.', post: updatedPost });

  } catch (error) {
    console.error("Post update error:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error during post update' });
  }
};

// SOFT DELETE POST (mark as deleted, only by author)
exports.softDeletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById({
      _id: postId,
      authorId: req.userId
    });

    if (!req.userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    if (!post || post.isDeleted) {
      return res.status(404).json({ message: 'Post not found or already deleted.' });
    }

    if (post.authorId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own posts.' });
    }

    post.isDeleted = true;
    post.deletedAt = new Date();
    await post.save();

    res.status(200).json({
      message: 'Post successfully moved to trash (soft deleted).',
      post
    });

  } catch (err) {
    console.error(`Failed to soft delete post ${req.params.id}:`, err);

    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid post ID format.' });
    }
    res.status(500).json({ message: 'An internal server error occurred while deleting the post.' });
  }
};

exports.userPostsdeleted = async (req, res) => {
  try {

    const userPostsdeleted = await Post.find({
      authorId: req.userId,
      isDeleted: true,
    }).sort({ createdAt: -1 });

    res.status(200).json(userPostsdeleted);
  } catch (err) {
    console.error("Error retrieving user's posts:", err);
    res.status(500).json({ message: "An internal server error occurred while retrieving user's posts." });
  }
};
