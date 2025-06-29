const Post = require('../models/posts'); // Adjust path as needed

// Controller to count total posts by a user
const countPostsByUser = async (req, res) => {
  try {
    // console.log("User ID:", req.userId);
    const userId = req.userId; // Assuming you use auth middleware that sets req.user
    const count = await Post.countDocuments({ 
      authorId: userId,
      status: 'published',
      isDeleted: false,
      archive:false
    }); // or { user: userId } based on your schema
    res.status(200).json({ totalPosts: count });
  } catch (err) {
    res.status(500).json({ message: 'Error counting posts', error: err.message });
  }
};

module.exports = { countPostsByUser };
