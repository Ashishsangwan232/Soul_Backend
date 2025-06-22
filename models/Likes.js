const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    userId: { // The user who performed the like
        type: Schema.Types.ObjectId,
        ref: 'user', // Assuming you have a User model named 'user'
        required: true
    },
    targetId: { // The ID of the item being liked (Post or Comment)
        type: Schema.Types.ObjectId,
        required: true,
        // We'll use 'targetType' to know which collection this ID refers to
    },
    targetType: { // To distinguish between a like on a Post or a Comment
        type: String,
        enum: ['Post', 'Comment'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Optional: Add a compound index to prevent duplicate likes by the same user on the same item
likeSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

// Optional: Index for efficiently querying likes for a specific target
likeSchema.index({ targetId: 1, targetType: 1 });

module.exports = mongoose.model('Like', likeSchema);
