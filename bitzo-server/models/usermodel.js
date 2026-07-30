

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    avatar: {
      type: String,
      default: null, // or a default avatar URL
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },

    role: {
      type: String,
      enum: ["viewer", "creator", "admin"],
      default: "creator",
    },

    deviceId: {
      type: String,
      unique: true,
      sparse: true,
    },

    googleId: String,

    // In your userSchema
    avatar: {
      type: String, // URL ke liye
      default: null,
    },

    avatarFileId: {
      // ← Naya field add karo (ye bahut zaroori hai delete ke liye)
      type: String,
      default: null,
      select: false, // sensitive nahi hai lekin phir bhi
    },

    trustScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },

    // All channels created by this user
    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
      },
    ],

    // All videos uploaded by this user
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

   likedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    dislikedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    subscribedChannels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",          // ← Channel model
      },
    ],

    watchLaterVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    

    viewedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    rewardPoints: {
      type: Number,
      default: 10,
      min: 0,
    },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
