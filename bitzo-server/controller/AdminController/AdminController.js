const User = require("../../models/admin/AdminModel");
const AllUser = require("../../models/usermodel");
const RefreshToken = require("../../models/RefreshToken");
const imagekit = require("../../utils/imagekit.js");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  REFRESH_TOKEN_TTL_MS,
} = require("../../utils/tokenService");
const {
  ADMIN_REFRESH_COOKIE,
  setRefreshCookie,
  clearRefreshCookie,
} = require("../../utils/refreshCookie");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, registerKey } = req.body;

    // Admin registration gate:
    // - Production: ADMIN_REGISTER_KEY is mandatory.
    // - Development: allowed only when no key is configured.
    // A configured key must always match, even in development.
    const envKey = process.env.ADMIN_REGISTER_KEY;
    const isDev = process.env.NODE_ENV !== "production";

    if (envKey) {
      if (typeof registerKey !== "string" || registerKey !== envKey) {
        return res.status(403).json({
          success: false,
          message: "Admin registration requires a valid setup key",
        });
      }
    } else if (!isDev) {
      return res.status(403).json({
        success: false,
        message: "Admin registration requires a valid setup key",
      });
    }

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Email check
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: signAccessToken({ userId: user._id, role: user.role }),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 15));
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      AllUser.find(filter)
        .select(
          "name email role avatar trustScore rewardPoints createdAt channels videos",
        )
        .populate({
          path: "channels",
          select: "name handle channelImage createdAt",
          populate: {
            path: "videos",
            select: "title thumbnail likesCount views createdAt",
            options: { limit: 4, sort: { createdAt: -1 } },
          },
        })
        .populate({
          path: "videos",
          select: "title thumbnail likesCount views createdAt channel",
          options: { limit: 4, sort: { createdAt: -1 } },
          populate: {
            path: "channel",
            select: "name handle",
          },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      AllUser.countDocuments(filter),
    ]);

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const formattedUsers = users.map((user) => {
      if (user.avatar && !user.avatar.startsWith("http")) {
        user.avatar = `${baseUrl}/${user.avatar}`;
      }

      const channels = (user.channels || []).map((ch) => {
        if (ch.channelImage && !ch.channelImage.startsWith("http")) {
          ch.channelImage = `${baseUrl}/${ch.channelImage}`;
        }

        const videos = (ch.videos || []).map((v) => {
          if (v.thumbnail && !v.thumbnail.startsWith("http")) {
            v.thumbnail = `${baseUrl}/${v.thumbnail}`;
          }
          return {
            ...v,
            channelName: ch.name || ch.handle || "—",
          };
        });

        return {
          _id: ch._id,
          name: ch.name || "Unnamed Channel",
          handle: ch.handle || null,
          channelImage: ch.channelImage || null,
          createdAt: ch.createdAt,
          totalVideos: videos.length,
          videos,
        };
      });

      const videos = (user.videos || []).map((v) => {
        if (v.thumbnail && !v.thumbnail.startsWith("http")) {
          v.thumbnail = `${baseUrl}/${v.thumbnail}`;
        }
        return {
          ...v,
          channelName: v.channel?.name || v.channel?.handle || "—",
        };
      });

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        trustScore: user.trustScore ?? 50,
        rewardPoints: user.rewardPoints ?? 0,
        createdAt: user.createdAt,
        totalChannels: channels.length,
        totalVideos: videos.length,
        channels,
        videos,
      };
    });

    res.status(200).json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: formattedUsers,
    });
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch users",
    });
  }
};

// GET single user with full details
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await AllUser.findById(id)
      .select(
        "name email role avatar trustScore rewardPoints createdAt channels videos",
      )
      .populate({
        path: "channels",
        select: "name handle channelImage createdAt",
        populate: {
          path: "videos",
          select: "title thumbnail likesCount views createdAt videoType",
          options: { sort: { createdAt: -1 } }, // full list (no limit)
        },
      })
      .populate({
        path: "videos",
        select: "title thumbnail likesCount views createdAt channel",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "channel",
          select: "name handle",
        },
      })
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Avatar
    if (user.avatar && !user.avatar.startsWith("http")) {
      user.avatar = `${baseUrl}/${user.avatar}`;
    }

    // Channels + their videos
    const channels = (user.channels || []).map((ch) => {
      if (ch.channelImage && !ch.channelImage.startsWith("http")) {
        ch.channelImage = `${baseUrl}/${ch.channelImage}`;
      }

      const videos = (ch.videos || []).map((v) => {
        if (v.thumbnail && !v.thumbnail.startsWith("http")) {
          v.thumbnail = `${baseUrl}/${v.thumbnail}`;
        }
        return {
          ...v,
          channelName: ch.name || ch.handle || "—",
        };
      });

      return {
        _id: ch._id,
        name: ch.name || "Unnamed Channel",
        handle: ch.handle || null,
        channelImage: ch.channelImage || null,
        createdAt: ch.createdAt,
        totalVideos: videos.length,
        videos,
      };
    });

    // User's own videos
    const videos = (user.videos || []).map((v) => {
      if (v.thumbnail && !v.thumbnail.startsWith("http")) {
        v.thumbnail = `${baseUrl}/${v.thumbnail}`;
      }
      return {
        ...v,
        channelName: v.channel?.name || v.channel?.handle || "—",
      };
    });

    const formattedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      trustScore: user.trustScore ?? 50,
      rewardPoints: user.rewardPoints ?? 0,
      createdAt: user.createdAt,
      totalChannels: channels.length,
      totalVideos: videos.length,
      channels,
      videos,
    };

    res.status(200).json({
      success: true,
      data: formattedUser,
    });
  } catch (err) {
    console.error("getUserById error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch user",
    });
  }
};

// ================== UPDATE USER ==================
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, trustScore, rewardPoints } = req.body;

    const user = await AllUser.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (role) user.role = role;
    if (trustScore !== undefined) user.trustScore = trustScore;
    if (rewardPoints !== undefined) user.rewardPoints = rewardPoints;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================== DELETE USER ==================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await AllUser.findByIdAndDelete(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================== ADMIN LOGIN ==================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      role: "admin",
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = signAccessToken({ userId: user._id, role: user.role });

    // 🔥 COOKIE SET KARO
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Admin refresh session (rotated on refresh), stored httpOnly.
    const refreshTokenValue = signRefreshToken({
      sub: String(user._id),
      kind: "admin",
    });
    await RefreshToken.create({
      userId: user._id,
      kind: "admin",
      tokenHash: hashToken(refreshTokenValue),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });
    setRefreshCookie(res, refreshTokenValue, "admin");

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================== ADMIN REFRESH ==================
exports.adminRefresh = async (req, res) => {
  try {
    const kind = "admin";
    const presented = req.cookies && req.cookies[ADMIN_REFRESH_COOKIE];

    if (!presented) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No refresh session" });
    }

    let payload;
    try {
      payload = verifyRefreshToken(presented);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid refresh session",
      });
    }

    if (!payload.sub) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid refresh session",
      });
    }

    const tokenHash = hashToken(presented);
    const session = await RefreshToken.findOne({ tokenHash }).lean();

    if (!session || session.kind !== kind) {
      clearRefreshCookie(res, "admin");
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Refresh session not found",
      });
    }

    // Rotated token being reused → revoke the whole admin session family.
    if (session.replacedBy) {
      await RefreshToken.updateMany(
        { userId: session.userId, kind },
        { $set: { revokedAt: new Date() } },
      );
      clearRefreshCookie(res, "admin");
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Refresh session reused",
      });
    }

    if (session.revokedAt) {
      clearRefreshCookie(res, "admin");
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Refresh session revoked",
      });
    }

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      await RefreshToken.deleteOne({ _id: session._id });
      clearRefreshCookie(res, "admin");
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Refresh session expired",
      });
    }

    const admin = await User.findById(session.userId);
    if (!admin) {
      await RefreshToken.deleteOne({ _id: session._id });
      clearRefreshCookie(res, "admin");
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Admin not found" });
    }

    // Rotate: revoke this session, create a child session.
    const newRefreshToken = signRefreshToken({ sub: String(admin._id), kind });
    const child = await RefreshToken.create({
      userId: admin._id,
      kind,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      rotatedFrom: session._id,
    });
    await RefreshToken.updateOne(
      { _id: session._id },
      { $set: { replacedBy: child._id, revokedAt: new Date() } },
    );

    const token = signAccessToken({ userId: admin._id, role: admin.role });
    setRefreshCookie(res, newRefreshToken, "admin");

    return res.status(200).json({
      success: true,
      message: "Token refreshed",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin refresh error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================== ADMIN LOGOUT ==================
exports.adminLogout = async (req, res) => {
  try {
    const presented = req.cookies && req.cookies[ADMIN_REFRESH_COOKIE];
    if (presented) {
      await RefreshToken.updateOne(
        { tokenHash: hashToken(presented), kind: "admin", revokedAt: null },
        { $set: { revokedAt: new Date() } },
      );
    }

    clearRefreshCookie(res, "admin");
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res
      .status(200)
      .json({ success: true, message: "Admin logged out successfully" });
  } catch (error) {
    console.error("Admin logout error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const fs = require("fs");
const path = require("path");

exports.registerEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "admin",
      registerKey,
      contactNumber,
      countryCode,
      dateOfJoining,
      experienceYears,
    } = req.body;

    const isDev = process.env.NODE_ENV !== "production";
    const defaultRegisterKey = "admin123";
    const envKey =
      process.env.ADMIN_REGISTER_KEY || (isDev ? defaultRegisterKey : "");

    if (envKey) {
      if (typeof registerKey !== "string" || registerKey.trim() !== envKey) {
        return res.status(403).json({
          success: false,
          message: "Admin registration requires a valid setup key",
        });
      }
    } else if (!isDev) {
      return res.status(403).json({
        success: false,
        message: "Admin registration requires a valid setup key",
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const allowedRoles = ["admin", "finance", "support", "read-only"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed: ${allowedRoles.join(", ")}`,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedContact = (contactNumber || "").trim();

    if (!normalizedContact) {
      return res.status(400).json({
        success: false,
        message: "Contact number is required",
      });
    }

    if (!dateOfJoining) {
      return res.status(400).json({
        success: false,
        message: "Date of joining is required",
      });
    }

    const parsedExperience = Number(experienceYears ?? 0);
    if (Number.isNaN(parsedExperience) || parsedExperience < 0) {
      return res.status(400).json({
        success: false,
        message: "Experience years must be a valid number",
      });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // ========== Profile Photo → ImageKit ==========
    let profilePhoto = "";

    if (req.files && req.files.profilePhoto) {
      const file = req.files.profilePhoto;

      // Validate image type
      const allowedMimes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedMimes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Only JPG, PNG or WEBP images are allowed",
        });
      }

      // Max 5MB
      if (file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: "Image size should be less than 5MB",
        });
      }

      try {
        const uploadResponse = await imagekit.upload({
          file: file.data, // buffer from express-fileupload / multer
          fileName: `admin_${Date.now()}_${file.name.replace(/\s+/g, "-")}`,
          folder: "/admin-profiles",
        });

        profilePhoto = uploadResponse.url; // full ImageKit CDN URL
      } catch (uploadErr) {
        console.error("ImageKit upload error:", uploadErr);
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile photo",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      contactNumber: normalizedContact,
      countryCode: (countryCode || "").trim(),
      dateOfJoining: new Date(dateOfJoining),
      experienceYears: parsedExperience,
      profilePhoto,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber,
        countryCode: user.countryCode,
        dateOfJoining: user.dateOfJoining,
        experienceYears: user.experienceYears,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

exports.loginEmployee = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Validate role if provided
    const validRoles = ["admin", "finance", "support", "read-only"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role provided",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials or account disabled",
      });
    }

    // If role is specified, validate that user has this role
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `User does not have ${role} role. Actual role: ${user.role}`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = signAccessToken({
      userId: user._id,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const refreshTokenValue = signRefreshToken({
      sub: String(user._id),
      kind: "admin",
    });

    await RefreshToken.create({
      userId: user._id,
      kind: "admin",
      tokenHash: hashToken(refreshTokenValue),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });

    setRefreshCookie(res, refreshTokenValue, "admin");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto || null,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
