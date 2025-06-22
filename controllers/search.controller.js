const Post = require('../models/posts');
const User = require('../models/user');

exports.searchPosts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is missing." });
    }

    // Find all users that match the search query in username
    const matchingUsers = await User.find({ username: { $regex: q, $options: 'i' } }, '_id');

    const userIds = matchingUsers.map(user => user._id);

    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { authorId: { $in: userIds } }
      ],
      status: 'published',
      isDeleted: false
    }).populate('authorId', 'username');

    res.json(posts);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed.' });
  }
};
