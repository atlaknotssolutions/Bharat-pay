const mongoose = require("mongoose");

const deviceFingerprintSchema = new mongoose.Schema(
  {
    deviceId: { type: String, unique: true, index: true }, // aapka server-issued id
    fingerprint: String, // client-side FingerprintJS visitorId (optional)
    userAgent: String,
    lastIp: String,
    associatedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    riskScore: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    lastSeen: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeviceFingerprint", deviceFingerprintSchema);