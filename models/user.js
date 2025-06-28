const mongoose = require("mongoose");
const { choices, urls } = require("../config/avatars"); // <-- import avatar config

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    default: null,
    unique: true,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  likeditems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Like'
  }],

  passwordRecentlyReset: { type: Boolean, default: false },
  passwordResetTime: Date,

  verified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  resetToken: String,
  resetTokenExpires: Date,

  profilePicKey: {
    type: String,
    enum: choices,
    default: 'oggy',
  },
  fcmToken: {
    type: String,
    default: null,
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual('profilePic').get(function () {
  return urls[this.profilePicKey];
});

module.exports = mongoose.model("user", userSchema);
