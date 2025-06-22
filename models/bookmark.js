const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  bookmarkedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

bookmarkSchema.index({ user: 1, post: 1 }, { unique: true }); 

module.exports = mongoose.model('Bookmark', bookmarkSchema);
