// controllers/likeController.js
const Like = require('../models/Likes'); // Adjust path as needed
const Post = require('../models/posts');   // Adjust path as needed
const Comment = require('../models/Comment'); // Adjust path as needed
const mongoose = require('mongoose');

// Helper function to update likesCount on Post or Comment
const updateTargetLikesCount = async (targetId, targetType, increment) => {
    const TargetModel = targetType === 'Post' ? Post : Comment;
    if (!TargetModel) {
        // This case should ideally not happen if targetType is validated
        throw new Error('Invalid target type specified.');
    }

    const updatedTarget = await TargetModel.findByIdAndUpdate(
        targetId,
        { $inc: { likesCount: increment } },
        { new: true, runValidators: true } // runValidators to respect potential min:0 on likesCount
    );

    if (!updatedTarget) {
        throw new Error(`${targetType} not found with ID: ${targetId}`);
    }
    return updatedTarget.likesCount;
};


exports.toggleLike = async (req, res) => {
    const { targetId, targetType } = req.body;
    const userId = req.user.id; // Assuming you have user info in req.user from auth middleware

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    if (!targetId || !targetType) {
        return res.status(400).json({ message: 'Target ID and Target Type are required.' });
    }

    if (!['Post', 'Comment'].includes(targetType)) {
        return res.status(400).json({ message: 'Invalid Target Type. Must be "Post" or "Comment".' });
    }

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
        return res.status(400).json({ message: `Invalid ${targetType} ID format.` });
    }

    try {
        const existingLike = await Like.findOne({ userId, targetId, targetType });

        let newLikesCount;
        let liked;

        if (existingLike) {
            // Like exists, so remove it (unlike)
            await Like.findByIdAndDelete(existingLike._id);
            newLikesCount = await updateTargetLikesCount(targetId, targetType, -1);
            liked = false;
            res.status(200).json({
                message: `${targetType} unliked successfully.`,
                liked,
                likesCount: newLikesCount
            });
        } else {
            // Like does not exist, so create it
            const newLike = new Like({ userId, targetId, targetType });
            await newLike.save();
            newLikesCount = await updateTargetLikesCount(targetId, targetType, 1);
            liked = true;
            res.status(201).json({
                message: `${targetType} liked successfully.`,
                liked,
                likesCount: newLikesCount,
                like: newLike // Optionally return the like object
            });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        if (error.message.includes('not found with ID')) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while toggling like.', error: error.message });
    }
};

exports.getLikesForTarget = async (req, res) => {
    const { targetId, targetType } = req.params;

    if (!targetId || !targetType) {
        return res.status(400).json({ message: 'Target ID and Target Type are required in params.' });
    }

    if (!['Post', 'Comment'].includes(targetType)) {
        return res.status(400).json({ message: 'Invalid Target Type. Must be "Post" or "Comment".' });
    }

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
        return res.status(400).json({ message: `Invalid ${targetType} ID format.` });
    }

    try {
        // First, check if the target item exists to provide a better error message
        const TargetModel = targetType === 'Post' ? Post : Comment;
        const targetExists = await TargetModel.findById(targetId).select('_id'); // Lightweight check
        if (!targetExists) {
            return res.status(404).json({ message: `${targetType} with ID ${targetId} not found.` });
        }

        const likes = await Like.find({ targetId, targetType })
            .populate({
                path: 'userId',
                select: 'name username profilePicture' // Adjust fields as per your User model
            })
            .sort({ createdAt: -1 }); // Show most recent likes first

        res.status(200).json({
            message: `Likes for ${targetType} fetched successfully.`,
            count: likes.length,
            likes // This will be an array of Like documents with user details populated
        });
    } catch (error) {
        console.error(`Error fetching likes for ${targetType}:`, error);
        res.status(500).json({ message: `Server error while fetching likes for ${targetType}.`, error: error.message });
    }
};


exports.checkUserLikeStatus = async (req, res) => {
    const { targetId, targetType } = req.params;
    const userId = req.user.id; // Assuming req.user.id from auth middleware

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    if (!targetId || !targetType) {
        return res.status(400).json({ message: 'Target ID and Target Type are required in params.' });
    }

    if (!['Post', 'Comment'].includes(targetType)) {
        return res.status(400).json({ message: 'Invalid Target Type. Must be "Post" or "Comment".' });
    }

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
        return res.status(400).json({ message: `Invalid ${targetType} ID format.` });
    }

    try {
        const like = await Like.findOne({ userId, targetId, targetType });
        res.status(200).json({ liked: !!like }); // true if like exists, false otherwise
    } catch (error) {
        console.error('Error checking like status:', error);
        res.status(500).json({ message: 'Server error while checking like status.', error: error.message });
    }
};

