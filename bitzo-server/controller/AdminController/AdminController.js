const User = require("../../models/admin/AdminModel");
const AllUser = require("../../models/usermodel");
const generateToken = require("../../utils/generateToken");
const bcrypt = require("bcryptjs");


exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
      token: generateToken(user._id),
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



// exports.getAllUsers = async (req, res) => {
//   try {
//     const page = Math.max(1, parseInt(req.query.page) || 1);
//     const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 15));
//     const skip = (page - 1) * limit;

//     const [users, total] = await Promise.all([
//       User.find()
//         .select(
//           "name email role avatar trustScore rewardPoints createdAt channels videos"
//         )
//         .populate({
//           path: "channels",
//           select: "name handle channelImage createdAt videos",
//           populate: {
//             path: "videos",
//             select: "title thumbnail likesCount views createdAt videoUrl channel",
//             options: {
//               limit: 4,
//               sort: { createdAt: -1 },
//             },
//           },
//         })
//         // User ke direct videos bhi (agar chahiye)
//         .populate({
//           path: "videos",
//           select: "title thumbnail likesCount views createdAt videoUrl channel",
//           options: {
//             limit: 4,
//             sort: { createdAt: -1 },
//           },
//           populate: {
//             path: "channel",
//             select: "name handle",
//           },
//         })
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),

//       User.countDocuments(),
//     ]);

//     const baseUrl = `${req.protocol}://${req.get("host")}`;

//     const formattedUsers = users.map((user) => {
//       // Avatar full URL
//       if (user.avatar && !user.avatar.startsWith("http")) {
//         user.avatar = `${baseUrl}/${user.avatar}`;
//       }

//       // ===== Channels formatting =====
//       if (user.channels?.length) {
//         user.channels = user.channels.map((channel) => {
//           // Channel image full URL
//           if (channel.channelImage && !channel.channelImage.startsWith("http")) {
//             channel.channelImage = `${baseUrl}/${channel.channelImage}`;
//           }

//           // Videos ke thumbnail full URL
//           if (channel.videos?.length) {
//             channel.videos = channel.videos.map((video) => {
//               if (video.thumbnail && !video.thumbnail.startsWith("http")) {
//                 video.thumbnail = `${baseUrl}/${video.thumbnail}`;
//               }
//               // Video ke saath channel name attach kar do
//               video.channelName = channel.name || channel.handle || "—";
//               return video;
//             });
//           }

//           return {
//             _id: channel._id,
//             name: channel.name || "Unnamed Channel",
//             handle: channel.handle || null,
//             channelImage: channel.channelImage || null,
//             createdAt: channel.createdAt,
//             totalVideos: channel.videos?.length || 0,
//             videos: channel.videos || [],
//           };
//         });
//       }

//       // ===== User ke direct videos formatting =====
//       if (user.videos?.length) {
//         user.videos = user.videos.map((video) => {
//           if (video.thumbnail && !video.thumbnail.startsWith("http")) {
//             video.thumbnail = `${baseUrl}/${video.thumbnail}`;
//           }
//           return {
//             ...video,
//             channelName: video.channel?.name || video.channel?.handle || "—",
//           };
//         });
//       }

//       return {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         avatar: user.avatar,
//         trustScore: user.trustScore,
//         rewardPoints: user.rewardPoints,
//         createdAt: user.createdAt,

//         // ===== Important counts =====
//         totalChannels: user.channels?.length || 0,
//         totalVideos: user.videos?.length || 0,

//         // Full channels list with name + videos
//         channels: user.channels || [],

//         // Latest videos (with channel name)
//         videos: user.videos || [],
//       };
//     });

//     res.status(200).json({
//       success: true,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//       data: formattedUsers,
//     });
//   } catch (err) {
//     console.error("getAllUsers error:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message || "Failed to fetch users",
//     });
//   }
// };



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
          "name email role avatar trustScore rewardPoints createdAt channels videos"
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
        "name email role avatar trustScore rewardPoints createdAt channels videos"
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
      return res.status(404).json({ success: false, message: "User not found" });
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
      return res.status(404).json({ success: false, message: "User not found" });
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

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
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

    const token = generateToken(user._id);

    // 🔥 COOKIE SET KARO
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // production me true
      sameSite: "lax",
    });

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


