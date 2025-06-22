const Bookmark = require('../models/bookmark');
const Post = require('../models/posts'); // Optional, for validation

// ✅ Get all bookmarks for the logged-in user
exports.getMyBookmarks = async (req, res) => {
  const userId = req.user.id;

  try {
    const bookmarks = await Bookmark.find({ 
      user: userId
     }).populate('post');
    res.status(200).json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 Toggle bookmark (add if not bookmarked, remove if exists)
exports.toggleBookmark = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const existing = await Bookmark.findOne({ user: userId, post: postId });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ message: 'Bookmark removed.' });
    } else {
      const bookmark = await Bookmark.create({ user: userId, post: postId });
      return res.status(201).json({ message: 'Bookmarked successfully.', bookmark });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
  