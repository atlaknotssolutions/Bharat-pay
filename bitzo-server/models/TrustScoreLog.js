const mongoose = require("mongoose");

const trustScoreLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    previousScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    newScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    change: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      default: null,
      trim: true,
    },
    source: {
      type: String,
      default: null,
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true },
);

trustScoreLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("TrustScoreLog", trustScoreLogSchema);
