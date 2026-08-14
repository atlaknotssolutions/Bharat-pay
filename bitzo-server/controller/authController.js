const User = require("../models/usermodel");
const WatchSession = require("../models/WatchSession");
const RefreshToken = require("../models/RefreshToken");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  REFRESH_TOKEN_TTL_MS,
} = require("../utils/tokenService");
const bcrypt = require("bcryptjs"); // ← make sure this is installed
const crypto = require("crypto");
const mongoose = require("mongoose");
const imagekit = require("../utils/imagekit.js");
const path = require("path");
const { resolveDeviceId } = require("../utils/deviceCookie");
const {
  REFRESH_COOKIE,
  setRefreshCookie,
  clearRefreshCookie,
} = require("../utils/refreshCookie");


const { detectVPN } = require("../services/vpn.service/vpn.service.js");
const {
  logFraudEvent,
  analyzeBehavior,
  applyRiskToUser,
} = require("../services/vpn.service/fraud.service.js");



const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.ip ||
    "unknown"
  );
};

// Creates a refresh-token session for a user/admin and returns the raw token.
// Only the hash is persisted. The caller sets the httpOnly cookie.
const createAuthSession = async (userId, kind = "user") => {
  const refreshToken = signRefreshToken({ sub: String(userId), kind });
  await RefreshToken.create({
    userId,
    kind,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });
  return refreshToken;
};

/* ===================== REGISTER ===================== */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Device lock (server-issued device id from HttpOnly cookie)
    const deviceId = resolveDeviceId(req, res);
    const deviceExists = await User.findOne({ deviceId });
    if (deviceExists) {
      return res.status(400).json({
        success: false,
        message: "This device is already registered",
      });
    }

    // Email check
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // 🔐 HASH PASSWORD IN CONTROLLER
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);



    const ip = getClientIp(req);
// const ua = req.headers["user-agent"];
const vpnInfo = await detectVPN(ip);

await logFraudEvent({
  userId: user._id,
  eventType: "REGISTER",
  severity: vpnInfo.isVPN ? "medium" : "low",
  ip,
  deviceId,
  userAgent: ua,
  isVPN: vpnInfo.isVPN,
  isProxy: vpnInfo.isProxy,
  riskScoreImpact: vpnInfo.isVPN ? 15 : 0,
  metadata: { country: vpnInfo.country },
});

if (vpnInfo.isVPN) {
  await applyRiskToUser(user._id, 15, ["VPN used during registration"]);
}


    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      deviceId,
    });

    // Auto-login: issue access token + refresh session (rotated on refresh)
    const token = signAccessToken({ userId: user._id, role: user.role });
    const refreshToken = await createAuthSession(user._id, "user");
    setRefreshCookie(res, refreshToken, "user");

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        trustScore: user.trustScore,
        avatar: user.avatar || null,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4️⃣ Device binding (server-issued device id from HttpOnly cookie)
    // A cookie-less browser/device must NOT silently take ownership of the
    // account. Any mismatch (fresh browser, cleared cookies, different profile)
    // returns DEVICE_LOCKED; the explicit claim-device flow is the only rebind
    // path. The only auto-bind is the very first binding of a legacy account.
    const deviceId = resolveDeviceId(req, res);

    if (user.deviceId && user.deviceId !== deviceId) {
      return res.status(403).json({
        success: false,
        code: "DEVICE_LOCKED",
        message:
          "Your account is currently linked to another browser or device. If you don't have access to that browser, you can continue on this device by signing out all other active sessions.",
      });
    }

    

    if (!user.deviceId) {
      user.deviceId = deviceId;
      await user.save();
    }


    // const ip = getClientIp(req);
// const deviceId = resolveDeviceId(req, res);
// const ua = req.headers["user-agent"];

await logFraudEvent({
  userId: user?._id || null,
  eventType: "LOGIN_FAILED",
  severity: "medium",
  ip,
  deviceId,
  userAgent: ua,
  riskScoreImpact: 8,
});

if (user) {
  const { riskPoints, reasons } = await analyzeBehavior(user._id);
  if (riskPoints > 0) {
    await applyRiskToUser(user._id, riskPoints, reasons);
  }
}

const ip = getClientIp(req);
const ua = req.headers["user-agent"];
const vpnInfo = await detectVPN(ip);

await logFraudEvent({
  userId: user._id,
  eventType: "LOGIN_SUCCESS",
  severity: vpnInfo.isVPN ? "medium" : "low",
  ip,
  deviceId,
  userAgent: ua,
  isVPN: vpnInfo.isVPN,
  isProxy: vpnInfo.isProxy,
  riskScoreImpact: vpnInfo.isVPN ? 10 : 0,
});

const { riskPoints, reasons } = await analyzeBehavior(user._id);
if (riskPoints > 0 || vpnInfo.isVPN) {
  await applyRiskToUser(user._id, riskPoints + (vpnInfo.isVPN ? 10 : 0), [
    ...reasons,
    ...(vpnInfo.isVPN ? ["VPN detected"] : []),
  ]);
}

await logFraudEvent({
  userId: user._id,
  eventType: "DEVICE_CLAIM",
  severity: "high",
  ip: getClientIp(req),
  deviceId,
  userAgent: req.headers["user-agent"],
  riskScoreImpact: 25,
  metadata: { previousDevice: user.deviceId },
});

await applyRiskToUser(user._id, 25, ["Device claim performed"]);


    // 5️⃣ Generate JWT token
    const token = signAccessToken({ userId: user._id, role: user.role });

    // 6️⃣ Set cookies (access token cookie kept for compatibility; refresh session)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ prod safe
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    const refreshToken = await createAuthSession(user._id, "user");
    setRefreshCookie(res, refreshToken, "user");


    
    // 7️⃣ Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // optional (frontend header use ke liye)
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
        trustScore: user.trustScore,
        avatar: user.avatar || null,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ===================== CLAIM DEVICE =====================
   Recovery path for the DEVICE_LOCKED login flow.
   After credential re-verification, this releases the account from its
   previously bound device so the current browser/device becomes the active
   device. All refresh-token sessions are revoked, matching the resetPassword
   and logout revocation patterns. No tokens are issued here. */
exports.claimDevice = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const deviceId = resolveDeviceId(req, res);

    // Nothing to claim: the account is already usable on this device.
    if (!user.deviceId || user.deviceId === deviceId) {
      return res.status(400).json({
        success: false,
        message: "This device is already linked to your account. You can sign in now.",
      });
    }

    // 1-device = 1-account hard limit: this device must not already be bound
    // to another account, otherwise rebinding here would violate the unique
    // deviceId constraint (E11000) and steal the device from that account.
    const deviceOwner = await User.findOne({ deviceId, _id: { $ne: user._id } });
    if (deviceOwner) {
      return res.status(400).json({
        success: false,
        message:
          "This browser or device is already linked to a different account. Sign in with that account on this device instead.",
      });
    }

    // Revoke every refresh session for this user so old devices cannot refresh.
    await RefreshToken.updateMany(
      { userId: user._id, kind: "user" },
      { $set: { revokedAt: new Date() } }
    );

    // Clear any auth cookies on this response (same as logout).
    clearRefreshCookie(res, "user");
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    // Release the old binding and make this device the account's active device.
    user.deviceId = deviceId;
    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "All other sessions have been signed out. You can now sign in on this device.",
    });
  } catch (error) {
    console.error("❌ Claim device error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "channels",
        select: "name channelImage subscribedBy",
      })
      .populate({
        path: "videos",
        select: "title thumbnail views likesCount createdAt videoType duration",
      })
      .select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const populatedUser = user.toObject();
    populatedUser.totalVideos = populatedUser.videos?.length || 0;
    populatedUser.totalViews = (populatedUser.videos || []).reduce(
      (sum, video) => sum + Number(video.views || 0),
      0,
    );
    populatedUser.totalEarnings = 0;
    populatedUser.avgRPM = 0;
    populatedUser.subscribers =
      populatedUser.channels?.reduce(
        (count, channel) => count + Number(channel.subscribedBy?.length || 0),
        0,
      ) || 0;

    const tzOffset = Math.min(
      840,
      Math.max(-840, Number(req.query.tzOffsetMinutes) || 0),
    );
    const localNow = new Date(Date.now() - tzOffset * 60000);
    const localDayStart = new Date(localNow);
    localDayStart.setUTCHours(0, 0, 0, 0);
    const dayStartUtc = new Date(localDayStart.getTime() + tzOffset * 60000);

    const [todayResult] = await WatchSession.aggregate([
      { $match: { userId: user._id, startedAt: { $gte: dayStartUtc } } },
      { $group: { _id: null, seconds: { $sum: "$watchedSeconds" } } },
    ]);
    const [totalResult] = await WatchSession.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: null, seconds: { $sum: "$watchedSeconds" } } },
    ]);

    populatedUser.watchTimeTodaySeconds =
      todayResult?.seconds || 0;
    populatedUser.watchTimeTotalSeconds =
      totalResult?.seconds || 0;

    res.status(200).json({
      success: true,
      user: populatedUser,
    });
  } catch (error) {
    console.error("getMyProfile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    // Authorization identity comes from the JWT (authMiddleware), never from
    // req.params.id. The :id URL parameter is kept for frontend compatibility.
    if (
      req.params.id &&
      String(req.params.id) !== String(req.user?.id)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden" });
    }

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { oldPassword, newPassword } = req.body || {};

    if (!oldPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is required" });
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long",
      });
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.UserEdit = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format" });
    }

    const user = await User.findById(userId).select(
      "+avatar +avatarFileId +name +email",
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const updateData = {};
    const oldAvatarFileId = user.avatarFileId;

    // ====================== AVATAR ======================
    if (req.file) {
      const file = req.file;

      if (!file.mimetype?.startsWith("image/")) {
        return res
          .status(400)
          .json({ success: false, message: "Only image files are allowed" });
      }
      if (file.size > 5 * 1024 * 1024) {
        return res
          .status(400)
          .json({ success: false, message: "Image must be less than 5MB" });
      }

      const fileExt = path.extname(file.originalname || ".jpg").toLowerCase();
      const fileName = `avatar_${user._id}_${Date.now()}${fileExt}`;

      const uploadResponse = await imagekit.upload({
        file: file.buffer,
        fileName,
        folder: "/avatars",
        useUniqueFileName: true,
      });

      updateData.avatar = uploadResponse.url;
      updateData.avatarFileId = uploadResponse.fileId; // ← Ye important hai
    }

    // ====================== NAME ======================
    if (req.body?.name !== undefined) {
      const trimmedName = String(req.body.name).trim();

      if (!trimmedName) {
        return res
          .status(400)
          .json({ success: false, message: "Name cannot be empty" });
      }
      if (trimmedName.length < 2 || trimmedName.length > 50) {
        return res.status(400).json({
          success: false,
          message: "Name must be 2-50 characters long",
        });
      }
      if (trimmedName !== user.name) {
        updateData.name = trimmedName;
      }
    }

    // ====================== EMAIL ======================
    if (req.body?.email !== undefined) {
      const newEmail = String(req.body.email).trim().toLowerCase();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email format" });
      }

      if (newEmail !== user.email) {
        const emailExists = await User.findOne({ email: newEmail }).lean();
        if (emailExists) {
          return res
            .status(409)
            .json({ success: false, message: "Email already in use" });
        }
        updateData.email = newEmail;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({
        success: true,
        message: "No changes provided",
        user: user.toObject({ versionKey: false }),
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    )
      .select(
        "-password -__v -googleId -deviceId -createdAt -updatedAt -avatarFileId",
      )
      .lean();

    // ====================== DELETE OLD AVATAR (Non-blocking) ======================
    if (updateData.avatar && oldAvatarFileId) {
      (async () => {
        try {
          await imagekit.deleteFile(oldAvatarFileId);
          console.log(`Old avatar deleted: ${oldAvatarFileId}`);
        } catch (err) {
          console.warn(
            "[Non-critical] Failed to delete old avatar:",
            err.message,
          );
        }
      })();
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UserEdit error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      ...(process.env.NODE_ENV === "development" && { debug: error.message }),
    });
  }
};

/* ===================== REFRESH (rotation + reuse detection) ===================== */
exports.refreshToken = async (req, res) => {
  try {
    const kind = "user";
    const presented = req.cookies && req.cookies[REFRESH_COOKIE];

    if (!presented) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No refresh session" });
    }

    let payload;
    try {
      payload = verifyRefreshToken(presented);
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid refresh session" });
    }

    if (!payload.sub) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid refresh session" });
    }

    const tokenHash = hashToken(presented);
    const session = await RefreshToken.findOne({ tokenHash }).lean();

    if (!session || session.kind !== kind) {
      clearRefreshCookie(res, "user");
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Refresh session not found" });
    }

    // Rotated token being reused → treat as theft: revoke the whole family.
    if (session.replacedBy) {
      await RefreshToken.updateMany(
        { userId: session.userId, kind },
        { $set: { revokedAt: new Date() } }
      );
      clearRefreshCookie(res, "user");
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Refresh session reused" });
    }

    if (session.revokedAt) {
      clearRefreshCookie(res, "user");
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Refresh session revoked" });
    }

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      await RefreshToken.deleteOne({ _id: session._id });
      clearRefreshCookie(res, "user");
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Refresh session expired" });
    }

    const user = await User.findById(session.userId);
    if (!user) {
      await RefreshToken.deleteOne({ _id: session._id });
      clearRefreshCookie(res, "user");
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - User not found" });
    }

    // Rotate: revoke this session, create a child session.
    const newRefreshToken = await createAuthSession(user._id, "user");
    const child = await RefreshToken.findOne({ tokenHash: hashToken(newRefreshToken) }).lean();
    await RefreshToken.updateOne(
      { _id: session._id },
      { $set: { replacedBy: child._id, revokedAt: new Date() } }
    );

    const token = signAccessToken({ userId: user._id, role: user.role });
    setRefreshCookie(res, newRefreshToken, "user");

    return res.status(200).json({
      success: true,
      message: "Token refreshed",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
      },
    });
  } catch (error) {
    console.error("Refresh error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===================== LOGOUT (real server-side revocation) ===================== */
exports.logout = async (req, res) => {
  try {
    const presented = req.cookies && req.cookies[REFRESH_COOKIE];
    if (presented) {
      await RefreshToken.updateOne(
        { tokenHash: hashToken(presented), kind: "user", revokedAt: null },
        { $set: { revokedAt: new Date() } }
      );
    }

    clearRefreshCookie(res, "user");
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===================== LOGOUT ALL (revoke every user session) ===================== */
// Revokes ALL active refresh-token sessions for the authenticated user.
// The backend cannot delete cookies from other browsers/devices: their refresh
// sessions die server-side and their next refresh returns 401, at which point
// the frontend clears local auth state. Existing stateless access JWTs expire
// naturally (short-lived); no JWT blacklist is introduced.
exports.logoutAll = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await RefreshToken.updateMany(
      { userId, kind: "user", revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );

    clearRefreshCookie(res, "user");
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Signed out from all browsers and devices",
    });
  } catch (error) {
    console.error("Logout all error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===================== FORGOT PASSWORD ===================== */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    const user = normalizedEmail
      ? await User.findOne({ email: normalizedEmail })
      : null;

    if (user) {
      // Cryptographically secure, single-use, short-lived reset token.
      const resetToken = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            resetTokenHash: hashToken(resetToken),
            resetTokenExpires: expiresAt,
          },
        }
      );

      // NOTE: no email provider is configured in this project. In production,
      // send a reset link containing the RAW resetToken to the user's email
      // here. The raw token is never logged and only its hash is persisted.
      // console.log(resetToken)  // ❌ NEVER DO THIS
    }

    // Generic response: never reveal whether the email exists.
    return res.status(200).json({
      success: true,
      message:
        "If an account exists for this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ===================== RESET PASSWORD ===================== */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body || {};

    if (typeof token !== "string" || !token) {
      return res
        .status(400)
        .json({ success: false, message: "Reset token is required" });
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 8 characters" });
    }

    const tokenHash = hashToken(token);
    const user = await User.findOne({ resetTokenHash: tokenHash }).select(
      "+resetTokenHash"
    );

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    if (
      !user.resetTokenExpires ||
      new Date(user.resetTokenExpires).getTime() < Date.now()
    ) {
      // Expired token: clear it so it cannot be reused.
      await User.updateOne(
        { _id: user._id },
        { $unset: { resetTokenHash: 1, resetTokenExpires: 1 } }
      );
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetTokenHash: 1, resetTokenExpires: 1 },
      }
    );

    // Revoke all existing refresh sessions for this user after a reset.
    await RefreshToken.updateMany(
      { userId: user._id, kind: "user", revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );
    clearRefreshCookie(res, "user");

    return res
      .status(200)
      .json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

