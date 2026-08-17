const mongoose = require("mongoose");

const auditEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    eventType: {
      type: String,
      enum: [
        // Auth events
        "USER_REGISTER",
        "USER_LOGIN",
        "USER_LOGOUT",
        "USER_LOGOUT_ALL",
        "PASSWORD_CHANGE",
        "PASSWORD_RESET_REQUEST",
        "PASSWORD_RESET_COMPLETE",
        "PROFILE_UPDATE",
        "DEVICE_CLAIM",
        
        // Engagement events
        "VIDEO_VIEW",
        "VIDEO_LIKE",
        "VIDEO_DISLIKE",
        "VIDEO_UPLOAD",
        "VIDEO_DELETE",
        "COMMENT_ADD",
        "COMMENT_DELETE",
        "CHANNEL_CREATE",
        "CHANNEL_DELETE",
        "CHANNEL_SUBSCRIBE",
        "CHANNEL_UNSUBSCRIBE",
        "WATCH_LATER_ADD",
        "WATCH_LATER_REMOVE",
        "WATCH_HISTORY_CLEAR",
        
        // Admin events
        "ADMIN_USER_UPDATE",
        "ADMIN_USER_DELETE",
        "ADMIN_USER_SUSPEND",
        "ADMIN_USER_RESTORE",
        "ADMIN_USER_BAN",

        // Admin content moderation events
        "ADMIN_CHANNEL_DISABLE",
        "ADMIN_CHANNEL_ENABLE",
        "ADMIN_CHANNEL_BAN",
        "ADMIN_CHANNEL_RESTORE",
        "ADMIN_CHANNEL_DELETE",
        "ADMIN_VIDEO_DISABLE",
        "ADMIN_VIDEO_ENABLE",
        "ADMIN_VIDEO_DELETE",
        "ADMIN_SHORT_DISABLE",
        "ADMIN_SHORT_ENABLE",
        "ADMIN_SHORT_DELETE",
      ],
      required: true,
    },
    ip: String,
    deviceId: String,
    userAgent: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

auditEventSchema.index({ userId: 1, createdAt: -1 });
auditEventSchema.index({ createdAt: -1 });
auditEventSchema.index({ eventType: 1, createdAt: -1 });

module.exports = mongoose.model("AuditEvent", auditEventSchema);
