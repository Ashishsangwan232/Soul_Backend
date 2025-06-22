const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required.']
    },
    content: {
        type: String,
        required: [true, 'Content is required.']
    },
    category: {
        type: String,
        enum: ['story', 'journal', 'selfReflection'],
        required: [true, 'Category is required.']
    },
    // This can get using populate So that if user updates user name its can reflect in all existing postss.
    // authorName: {
    //     type: String,
    //     required: true
    // },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    },

    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],

    archive: {
        type: Boolean,
        default: false
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    // likes: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'user'
    // }],

    likesCount: {
        type: Number,
        default: 0,
    },

    bookmarks: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    
    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Post', postSchema);
