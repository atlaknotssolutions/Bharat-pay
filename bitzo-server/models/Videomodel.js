const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },

    videoType: [
      {
        type: String,
        enum: ["short", "long"],
      },
    ],

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    thumbnail: {
      type: String,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      min: 0,
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    dislikesCount: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },

   viewers: [
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    watchedPercent: {
      type: Number,
      default: 0,
    },
    counted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
],


    

    // ✅ ANONYMOUS COMMENTS
    comments: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Video", videoSchema);
