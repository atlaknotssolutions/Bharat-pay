const Video = require("../models/Videomodel");
const Channel = require("../models/Channel/ChannelModel");
const mongoose = require("mongoose");
const path = require("path");
const imagekit = require("../utils/imagekit");
const categoryModel = require("../models/CategoryModel/category.model");
const ChannelModel = require("../models/Channel/ChannelModel");
const User = require("../models/usermodel"); // ✅ Import User model

const createChannel = async (req, res) => {
  try {
    const { name, channeldescription, category, contactemail, videoUrl } =
      req.body;

    const userId = req.user.id;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Channel name and category are required",
      });
    }

    // Check category exists
    const categoryData = await categoryModel.findById(category);
    if (!categoryData) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    let channelImageUrl = "";
    let channelBannerUrl = "";

    if (req.files?.channelImage?.[0]) {
      try {
        const file = req.files.channelImage[0];
        console.log("Uploading channel image:", {
          name: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
        });

        const base64String = file.buffer.toString("base64");

        const imageRes = await imagekit.upload({
          file: base64String,
          fileName: `channel-img-${Date.now()}-${file.originalname}`,
          folder: "channelImages",
          overwriteFile: true,
        });
        channelImageUrl = imageRes.url;
        console.log("✅ Channel image uploaded:", channelImageUrl);
      } catch (imageError) {
        console.error("❌ ImageKit Error:", imageError);
        throw imageError;
      }
    }

    if (req.files?.channelBanner?.[0]) {
      try {
        const file = req.files.channelBanner[0];
        console.log("Uploading channel banner:", {
          name: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
        });

        const base64String = file.buffer.toString("base64");

        const bannerRes = await imagekit.upload({
          file: base64String,
          fileName: `channel-banner-${Date.now()}-${file.originalname}`,
          folder: "channelBanners",
          overwriteFile: true,
        });
        channelBannerUrl = bannerRes.url;
        console.log("✅ Channel banner uploaded:", channelBannerUrl);
      } catch (bannerError) {
        console.error("❌ ImageKit Error:", bannerError);
        throw bannerError;
      }
    }

    const newChannel = await Channel.create({
      name,
      channeldescription,
      category: categoryData._id,
      contactemail,
      videoUrl: videoUrl || "",
      channelImage: channelImageUrl,
      channelBanner: channelBannerUrl,
      creator: userId,
    });

    // ✅ Save channel ID into User's channels array
    await User.findByIdAndUpdate(userId, {
      $push: { channels: newChannel._id },
    });

    // Populate category name for response
    const populatedChannel = await Channel.findById(newChannel._id).populate(
      "category",
      "name",
    );

    return res.status(201).json({
      success: true,
      message: "Channel created successfully",
      channel: populatedChannel,
    });
  } catch (error) {
    console.error("Error in createChannel:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const uploadVideo = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { name, description, category, videoType } = req.body;

    const channel = await ChannelModel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    if (!req.files || !req.files.video) {
      return res.status(400).json({
        success: false,
        message: "Video file required",
      });
    }

    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

    const normalizeMediaPath = (filePath) => {
      if (!filePath) return null;

      const normalized = filePath.replace(/\\/g, "/");

      if (/^https?:\/\//i.test(normalized)) {
        return normalized;
      }

      const basename = path.basename(normalized);
      if (normalized.includes("uploads/")) {
        return normalized.replace(/^.*?(uploads\/.*)$/, "$1");
      }

      return `uploads/${basename}`;
    };

    const videoPath = normalizeMediaPath(videoFile.path);
    const thumbnailPath = normalizeMediaPath(thumbnailFile?.path || null);

    const newVideo = new Video({
      channel: channelId,
      category,
      title: name?.trim() || "Untitled",
      description,
      videoUrl: videoPath,
      thumbnail: thumbnailPath,
      videoType: videoType,
      uploadedBy: req.user?.userId,
    });

    await newVideo.save();

    // ✅ Push video ID into Channel's videos array
    channel.videos.push(newVideo._id);
    await channel.save();

    // ✅ Push video ID into User's videos array
    await User.findByIdAndUpdate(req.user?.userId, {
      $push: { videos: newVideo._id },
    });

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      video: newVideo,
    });
  } catch (err) {
    // console.error("========== VIDEO UPLOAD ERROR ==========");
    // console.error(error);
    // console.error("Message:", error.message);
    // console.error("Stack:", error.stack);
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// const getChannels = async (req, res) => {
//   try {
//     const channels = await Channel.find({}).populate("category", "_id name",).populate("Videosuser"); // 👈 id + name

//     res.status(200).json({
//       success: true,
//       channels,
//     });
//   } catch (error) {
//     console.error("Error in getChannels:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

const getChannels = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id; // handle both

    const channels = await Channel.find({ creator: userId }) // ✅ was "user", must be "creator"
      .populate("category", "_id name")
      .populate("creator"); // ✅ was "owner" which doesn't exist in schema

    return res.status(200).json({
      success: true,
      count: channels.length,
      channels,
    });
  } catch (error) {
    console.error("Error in getChannels:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getSubscribedChannels = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId).populate({
      path: "subscribedChannels",
      select: "name channelImage _id",
    });

    const channels = (user?.subscribedChannels || []).map((channel) => ({
      _id: channel._id,
      name: channel.name,
      channelImage: channel.channelImage || "",
      path: `/channel/${channel._id}`,
    }));

    return res.status(200).json({
      success: true,
      channels,
    });
  } catch (error) {
    console.error("Error in getSubscribedChannels:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET /api/channels/:id
// GET /api/uservideo/channel/:id
// Public channel page (channel info + videos)
const getChannelById = async (req, res) => {
  try {
    const channelId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid channel ID format",
      });
    }

    // Channel details
    const channel = await Channel.findById(channelId)
      .populate("category", "_id name")
      .populate("creator", "name email")
      .lean();

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    // Videos of this channel
    const videos = await Video.find({ channel: channelId })
      .populate("uploadedBy", "_id name email")
      .sort({ createdAt: -1 })
      .lean();

    // Check if current user is subscribed
    let isSubscribed = false;
    const userId = req.user?.id || req.user?.userId || req.user?._id;

    if (userId) {
      const user = await User.findById(userId).select("subscribedChannels");
      isSubscribed = (user?.subscribedChannels || []).some(
        (id) => id.toString() === channelId,
      );
    }

    return res.status(200).json({
      success: true,
      channel: {
        ...channel,
        isSubscribed,
        subscribersCount: channel.subscribedBy?.length || 0,
        videoCount: videos.length,
        handle:
          channel.handle ||
          channel.name?.toLowerCase().replace(/\s+/g, "") ||
          "channel",
        description: channel.channeldescription || channel.description || "",
      },
      videos,
    });
  } catch (error) {
    console.error("Error in getChannelById:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const mapVideoToListItem = (video) => ({
  _id: video?._id,
  id: video?._id,
  title: video?.title || "Untitled video",
  thumbnail:
    video?.thumbnail ||
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800",
  channel: video?.channel?.name || "Unknown channel",
  channelName: video?.channel?.name || "Unknown channel",
  duration: video?.duration || "—",
  watchedDate: video?.updatedAt
    ? new Date(video.updatedAt).toLocaleDateString()
    : "Recently watched",
  createdAt: video?.createdAt,
  videoUrl: video?.videoUrl,
  views: video?.views || 0,
  likesCount: video?.likesCount || 0,
});

const getUserWatchHistory = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId).populate({
      path: "viewedVideos",
      populate: {
        path: "channel",
        select: "name channelImage",
      },
      options: { sort: { updatedAt: -1 } },
    });

    const videos = (user?.viewedVideos || []).map(mapVideoToListItem);

    return res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error("Error in getUserWatchHistory:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getUserLikedVideos = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId).populate({
      path: "likedVideos",
      populate: {
        path: "channel",
        select: "name channelImage",
      },
      options: { sort: { createdAt: -1 } },
    });

    const videos = (user?.likedVideos || []).map(mapVideoToListItem);

    return res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error("Error in getUserLikedVideos:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getUserWatchLaterVideos = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId).populate({
      path: "watchLaterVideos",
      populate: {
        path: "channel",
        select: "name channelImage",
      },
      options: { sort: { createdAt: -1 } },
    });

    const videos = (user?.watchLaterVideos || []).map(mapVideoToListItem);

    return res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error("Error in getUserWatchLaterVideos:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getUserUploadedVideos = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const videos = await Video.find({ uploadedBy: userId })
      .populate("channel", "name channelImage")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      videos: videos.map(mapVideoToListItem),
    });
  } catch (error) {
    console.error("Error in getUserUploadedVideos:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getvideosByChannel = async (req, res) => {
  try {
    console.log("───────────────────────────────");
    console.log("URL hit:", req.originalUrl);
    console.log("req.params:", req.params);
    console.log("───────────────────────────────");

    // ✅ FIXED
    const channelId = req.params.id;

    // Channel ID check
    if (!channelId) {
      return res.status(400).json({
        success: false,
        message: "Channel ID is required in URL",
      });
    }

    // Mongo ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Channel ID format",
      });
    }

    // Find videos by channel
    const videos = await Video.find({ channel: channelId })
      .populate("uploadedBy", "_id name email")
      .populate({
        path: "channel",
        select: "name channelImage channelBanner channeldescription category",
      })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Videos found: ${videos.length}`);

    return res.status(200).json({
      success: true,
      count: videos.length,
      videos,
    });
  } catch (error) {
    console.error("Error in getvideosByChannel:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching videos",
    });
  }
};

const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;
    const channel = await Channel.find.findOneAndDelete({
      _id: channelId,
      creator: userId,
    });
    if (!channel) {
      return res
        .status(404)
        .json({ success: false, message: "Channel not found or unauthorized" });
    }
    await Video.deleteMany({ channel: channelId });
    res.status(200).json({
      success: true,
      message: "Channel and associated videos deleted",
    });
  } catch (error) {
    console.error("Error in deleteChannel:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("channel", "name channelImage")
      .populate("uploadedBy", "name email");
    res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error("Error in getAllVideos:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const recommendedVideos = async (req, res) => {
  try {
    const userCategory = req.user?.category; // user ki category

    let videos = [];

    if (userCategory) {
      const categoryVideos = await Video.find({
        category: userCategory,
        videoType: "long",
      })
        .sort({ createdAt: -1 }) // recent first
        .limit(10);

      videos = categoryVideos;
    }

    // 2️⃣ Agar 10 se kam mile toh baaki recent videos add karo
    if (videos.length < 10) {
      const remaining = 10 - videos.length;

      const otherVideos = await Video.find({
        category: { $ne: userCategory },
        videoType: "long",
      })
        .sort({ createdAt: -1 })
        .limit(remaining);

      videos = [...videos, ...otherVideos];
    }

    res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error("Error in recommendedVideos:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const trendingVideos = async (req, res) => {
  try {
    const videos = await Video.find({ videoType: "long" })
      .sort({ views: -1, createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error("Error in trendingVideos:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const LatestVideos = async (req, res) => {
  try {
    const videos = await Video.find({ videoType: "long" })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error("Error in LatestVideos:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const trendingShorts = async (req, res) => {
  try {
    const videos = await Video.find({ videoType: "short" })
      .sort({ views: -1, createdAt: -1 })
      .limit(10);

    const userId = req.user?.id || req.user?.userId || req.user?._id;
    let user = null;

    if (userId) {
      user = await User.findById(userId);
    }

    const likedVideoIds = new Set(
      (user?.likedVideos || []).map((id) => id.toString()),
    );
    const dislikedVideoIds = new Set(
      (user?.dislikedVideos || []).map((id) => id.toString()),
    );

    const videosWithReaction = videos.map((video) => {
      const videoId = video._id?.toString();
      let userReaction = null;

      if (videoId && likedVideoIds.has(videoId)) {
        userReaction = "like";
      } else if (videoId && dislikedVideoIds.has(videoId)) {
        userReaction = "dislike";
      }

      return {
        ...video.toObject(),
        userReaction,
      };
    });

    res.status(200).json({
      success: true,
      videos: videosWithReaction,
    });
  } catch (error) {
    console.error("Error in trendingShorts:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const topShorts = async (req, res) => {
  try {
    const videos = await Video.find({ videoType: "short" })
      .sort({ views: -1, createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error("Error in topShorts:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getVideoById = async (req, res) => {
  try {
    const videoId = req.params.id || req.params.videoId;
    const video = await Video.findById(videoId).populate(
      "channel",
      "name subscribersCount channelImage subscribedBy",
    );

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    const userId = req.user?.id || req.user?.userId || req.user?._id;
    let userReaction = null;
    let isSubscribed = false;
    let watchedPercent = 0;

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        if ((user.likedVideos || []).some((i) => i.toString() === videoId)) {
          userReaction = "like";
        } else if (
          (user.dislikedVideos || []).some((i) => i.toString() === videoId)
        ) {
          userReaction = "dislike";
        }

        isSubscribed = (user.subscribedChannels || []).some(
          (chId) => chId.toString() === video.channel?._id?.toString(),
        );
      }

      const viewerEntry = (video.viewers || []).find(
        (v) => v.userId?.toString() === userId.toString(),
      );
      if (viewerEntry) watchedPercent = viewerEntry.watchedPercent || 0;
    }

    res.status(200).json({
      success: true,
      video: {
        ...video.toObject(),
        userReaction,
        isSubscribed,
        watchedPercent,
        subscribersCount: video.channel?.subscribedBy?.length || 0,
      },
    });
  } catch (error) {
    console.error("Error in getVideoById:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const addView = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { watchedPercent, userId } = req.body || {};

    const video = await Video.findById(videoId);
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    const normalizedUserId = userId || req.user?.userId || req.user?.id;
    const percent = Math.min(100, Math.max(0, Number(watchedPercent) || 0));
    const watchedEnough = percent >= 80;

    let newlyCounted = false;

    if (normalizedUserId) {
      video.viewers = video.viewers || [];
      const viewerEntry = video.viewers.find(
        (v) => v.userId?.toString() === normalizedUserId.toString(),
      );

      if (viewerEntry) {
        if (percent > (viewerEntry.watchedPercent || 0)) {
          viewerEntry.watchedPercent = percent;
        }
        if (watchedEnough && !viewerEntry.counted) {
          viewerEntry.counted = true;
          viewerEntry.completedAt = new Date();
          video.views = (video.views || 0) + 1;
          newlyCounted = true;
        }
      } else {
        video.viewers.push({
          userId: normalizedUserId,
          watchedPercent: percent,
          counted: watchedEnough,
          completedAt: watchedEnough ? new Date() : undefined,
        });
        if (watchedEnough) {
          video.views = (video.views || 0) + 1;
          newlyCounted = true;
        }
      }

      const user = await User.findById(normalizedUserId);
      if (
        user &&
        watchedEnough &&
        !user.viewedVideos?.some((i) => i.toString() === videoId)
      ) {
        user.viewedVideos = user.viewedVideos || [];
        user.viewedVideos.push(video._id);
        await user.save();
      }
    }

    await video.save();

    res.status(200).json({
      success: true,
      message: watchedEnough ? "View counted" : "Watch progress recorded",
      views: video.views,
      watchedPercent: percent,
      counted: newlyCounted,
    });
  } catch (error) {
    console.error("Error in addView:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const likeVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const normalizedVideoId = videoId?.toString();
    const userId = req.user?.id || req.user?.userId || req.user?._id;

    // Guest users (no auth) – just increment, no toggle
    if (!userId) {
      const video = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { likesCount: 1 } },
        { new: true },
      );
      if (!video) {
        return res
          .status(404)
          .json({ success: false, message: "Video not found" });
      }
      return res.status(200).json({
        success: true,
        likes: video.likesCount || 0,
        dislikes: video.dislikesCount || 0,
        reaction: "like",
      });
    }

    // Authenticated user
    const [video, user] = await Promise.all([
      Video.findById(normalizedVideoId),
      User.findById(userId),
    ]);

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Ensure arrays exist
    user.likedVideos = user.likedVideos || [];
    user.dislikedVideos = user.dislikedVideos || [];

    const alreadyLiked = user.likedVideos.some(
      (id) => id.toString() === normalizedVideoId,
    );
    const alreadyDisliked = user.dislikedVideos.some(
      (id) => id.toString() === normalizedVideoId,
    );

    let reaction = null;

    if (alreadyLiked) {
      // UNLIKE
      user.likedVideos = user.likedVideos.filter(
        (id) => id.toString() !== normalizedVideoId,
      );
      video.likesCount = Math.max(0, (video.likesCount || 0) - 1);
      reaction = null;
    } else {
      // LIKE (and remove dislike if present)
      if (alreadyDisliked) {
        user.dislikedVideos = user.dislikedVideos.filter(
          (id) => id.toString() !== normalizedVideoId,
        );
        video.dislikesCount = Math.max(0, (video.dislikesCount || 0) - 1);
      }
      user.likedVideos.push(video._id);
      video.likesCount = (video.likesCount || 0) + 1;
      reaction = "like";
    }

    await Promise.all([user.save(), video.save()]);

    return res.status(200).json({
      success: true,
      likes: video.likesCount || 0,
      dislikes: video.dislikesCount || 0,
      reaction, // "like" | null
      liked: reaction === "like",
    });
  } catch (error) {
    console.error("Error in likeVideo:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// dislikeVideo waise hi rahega — usme already `|| []` defaults hain, koi change nahi chahiye.

const dislikeVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user?.id || req.user?.userId || req.user?._id;

    if (!userId) {
      const video = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { dislikesCount: 1 } },
        { new: true },
      );
      if (!video) {
        return res
          .status(404)
          .json({ success: false, message: "Video not found" });
      }
      return res.status(200).json({
        success: true,
        likes: video.likesCount || 0,
        dislikes: video.dislikesCount || 0,
        reaction: "dislike",
      });
    }

    const [video, user] = await Promise.all([
      Video.findById(videoId),
      User.findById(userId),
    ]);

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.likedVideos = user.likedVideos || [];
    user.dislikedVideos = user.dislikedVideos || [];

    const alreadyLiked = user.likedVideos.some(
      (id) => id.toString() === videoId,
    );
    const alreadyDisliked = user.dislikedVideos.some(
      (id) => id.toString() === videoId,
    );

    let reaction = null;

    if (alreadyDisliked) {
      // REMOVE DISLIKE
      user.dislikedVideos = user.dislikedVideos.filter(
        (id) => id.toString() !== videoId,
      );
      video.dislikesCount = Math.max(0, (video.dislikesCount || 0) - 1);
      reaction = null;
    } else {
      // DISLIKE (and remove like if present)
      if (alreadyLiked) {
        user.likedVideos = user.likedVideos.filter(
          (id) => id.toString() !== videoId,
        );
        video.likesCount = Math.max(0, (video.likesCount || 0) - 1);
      }
      user.dislikedVideos.push(video._id);
      video.dislikesCount = (video.dislikesCount || 0) + 1;
      reaction = "dislike";
    }

    await Promise.all([user.save(), video.save()]);

    return res.status(200).json({
      success: true,
      likes: video.likesCount || 0,
      dislikes: video.dislikesCount || 0,
      reaction, // "dislike" | null
    });
  } catch (error) {
    console.error("Error in dislikeVideo:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==================== SUBSCRIBE / UNSUBSCRIBE ====================
const subscribeChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user?.id || req.user?.userId || req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Login required" });
    }

    const user = await User.findById(userId);
    const channel = await Channel.findById(channelId);

    if (!user || !channel) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    user.subscribedChannels = user.subscribedChannels || [];
    channel.subscribedBy = channel.subscribedBy || [];

    const alreadySubscribed = user.subscribedChannels.some(
      (id) => id.toString() === channelId,
    );

    let subscribed = false;

    if (alreadySubscribed) {
      // Unsubscribe
      user.subscribedChannels = user.subscribedChannels.filter(
        (id) => id.toString() !== channelId,
      );
      channel.subscribedBy = channel.subscribedBy.filter(
        (id) => id.toString() !== userId,
      );
      subscribed = false;
    } else {
      // Subscribe
      user.subscribedChannels.push(channel._id);
      channel.subscribedBy.push(user._id);
      subscribed = true;
    }

    await user.save();
    await channel.save();

    res.status(200).json({
      success: true,
      subscribed,
      subscribersCount: channel.subscribedBy.length,
    });
  } catch (error) {
    console.error("Error in subscribeChannel:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { commentText } = req.body;
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    const userName = req.user?.name || req.user?.email || "User";

    if (!commentText || !commentText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text required",
      });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const newComment = {
      text: commentText.trim(),
      createdAt: new Date(),
      user: userId || null,
      userName,
    };

    video.comments.push(newComment);
    await video.save();

    res.status(200).json({
      success: true,
      message: "Comment added",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error in addComment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getComments = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId).select("comments");
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      comments: video.comments,
    });
  } catch (error) {
    console.error("Error in getComments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { videoId, commentId } = req.params;
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    const video = await Video.findById(videoId);
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }
    const commentIndex = video.comments.findIndex(
      (comment) => comment._id.toString() === commentId,
    );
    if (commentIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    const commentOwner = video.comments[commentIndex].user?.toString();
    if (userId && commentOwner && commentOwner !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment",
      });
    }
    video.comments.splice(commentIndex, 1);
    await video.save();
    res.status(200).json({ success: true, message: "Comment deleted!" });
  } catch (error) {
    console.error("Error in deleteComment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getVideoInteraction = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId).lean();

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    return res.status(200).json({
      success: true,
      liked: false, // user identify nahi ho raha
      disliked: false, // user identify nahi ho raha
      likes: video.likes?.length || 0,
      dislikes: video.dislikes?.length || 0,
    });
  } catch (error) {
    console.error("Error in getVideoInteraction:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// const subscribeChannel = async (req, res) => {
//   try {
//     const { channelId } = req.params;
//     const userId = req.user.id;

//     const channel = await Channel.findById(channelId);
//     if (!channel) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Channel not found" });
//     }

//     // Agar already subscribed hai to unsubscribe kar do (toggle)
//     const isSubscribed = channel.subscribedBy.includes(userId);

//     if (isSubscribed) {
//       // Unsubscribe
//       await Channel.findByIdAndUpdate(channelId, {
//         $pull: { subscribedBy: userId },
//         $inc: { subscribers: -1 },
//       });

//       await User.findByIdAndUpdate(userId, {
//         $pull: { subscribedChannels: channelId },
//       });

//       return res.json({
//         success: true,
//         message: "Unsubscribed successfully",
//         subscribed: false,
//       });
//     } else {
//       // Subscribe
//       await Channel.findByIdAndUpdate(channelId, {
//         $addToSet: { subscribedBy: userId },
//         $inc: { subscribers: 1 },
//       });

//       await User.findByIdAndUpdate(userId, {
//         $addToSet: { subscribedChannels: channelId },
//       });

//       return res.json({
//         success: true,
//         message: "Subscribed successfully",
//         subscribed: true,
//       });
//     }
//   } catch (error) {
//     console.error("Subscribe error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

const getSubscribedVideos = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId).select("subscribedChannels");
    const subscribedChannelIds = user?.subscribedChannels || [];

    const videos = await Video.find({
      channel: { $in: subscribedChannelIds },
      videoType: "long",
    })
      .sort({ createdAt: -1 })
      .populate("channel", "name channelImage")
      .populate("uploadedBy", "name email");

    res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error("Error in getSubscribedVideos:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const HistoricalVideos = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId).select("viewedVideos");
    const viewedVideoIds = user?.viewedVideos || [];

    if (viewedVideoIds.length === 0) {
      return res.status(200).json({
        success: true,
        videos: [],
      });
    }

    // Fetch all videos that the user has viewed
    const videos = await Video.find({
      _id: { $in: viewedVideoIds },
    })
      .populate("channel", "name channelImage")
      .populate("uploadedBy", "name email");

    // Preserve the order of viewedVideos (most recent watched first)
    // Assuming newer watches are pushed to the end of the array
    const videoMap = new Map(videos.map((v) => [v._id.toString(), v]));

    const orderedVideos = viewedVideoIds
      .slice()
      .reverse()
      .map((id) => videoMap.get(id.toString()))
      .filter(Boolean);

    res.status(200).json({
      success: true,
      videos: orderedVideos,
    });
  } catch (error) {
    console.error("Error in HistoricalVideos:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const LikedVideos = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId).select("likedVideos");
    const likedVideoIds = user?.likedVideos || [];

    if (likedVideoIds.length === 0) {
      return res.status(200).json({
        success: true,
        videos: [],
      });
    }

    // Fetch all liked videos
    const videos = await Video.find({
      _id: { $in: likedVideoIds },
    })
      .populate("channel", "name channelImage")
      .populate("uploadedBy", "name email");

    // Preserve the order of likedVideos (most recently liked first)
    // Assuming newer likes are pushed to the end of the array
    const videoMap = new Map(videos.map((v) => [v._id.toString(), v]));

    const orderedVideos = likedVideoIds
      .slice()
      .reverse()
      .map((id) => videoMap.get(id.toString()))
      .filter(Boolean);

    res.status(200).json({
      success: true,
      videos: orderedVideos,
    });
  } catch (error) {
    console.error("Error in LikedVideos:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const WatchLaterVideos = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId).select("watchLater");
    const watchLaterIds = user?.watchLater || [];

    if (watchLaterIds.length === 0) {
      return res.status(200).json({
        success: true,
        videos: [],
      });
    }

    // Fetch all watch later videos
    const videos = await Video.find({
      _id: { $in: watchLaterIds },
    })
      .populate("channel", "name channelImage")
      .populate("uploadedBy", "name email");

    // Preserve the order of watchLater (most recently added first)
    const videoMap = new Map(videos.map((v) => [v._id.toString(), v]));

    const orderedVideos = watchLaterIds
      .slice()
      .reverse()
      .map((id) => videoMap.get(id.toString()))
      .filter(Boolean);

    res.status(200).json({
      success: true,
      videos: orderedVideos,
    });
  } catch (error) {
    console.error("Error in WatchLaterVideos:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Remove a video from Watch Later
const RemoveFromWatchLater = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    const { videoId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: "Video ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingWatchLater = Array.isArray(user.watchLater)
      ? user.watchLater
      : [];
    const existingWatchLaterVideos = Array.isArray(user.watchLaterVideos)
      ? user.watchLaterVideos
      : [];

    user.watchLater = existingWatchLater.filter(
      (id) => id.toString() !== videoId.toString(),
    );
    user.watchLaterVideos = existingWatchLaterVideos.filter(
      (id) => id.toString() !== videoId.toString(),
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Video removed from Watch Later",
      removed: true,
      watchLaterCount: user.watchLater.length,
    });
  } catch (error) {
    console.error("Error in RemoveFromWatchLater:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const addToWatchLater = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    const { videoId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!videoId) {
      return res
        .status(400)
        .json({ success: false, message: "Video ID required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.watchLaterVideos = user.watchLaterVideos || [];
    user.watchLater = user.watchLater || [];

    const alreadyAdded =
      user.watchLaterVideos.some((id) => id.toString() === videoId) ||
      user.watchLater.some((id) => id.toString() === videoId);

    if (alreadyAdded) {
      return res.status(200).json({
        success: true,
        message: "Already in Watch Later",
        added: false,
      });
    }

    user.watchLaterVideos.push(videoId);
    user.watchLater.push(videoId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Added to Watch Later",
      added: true,
    });
  } catch (error) {
    console.error("Error in addToWatchLater:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getSearchHints = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    if (!q || q.length < 1) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const regex = new RegExp(q, "i");

    // Videos titles se hints
    const videoHints = await Video.find({ title: regex })
      .select("title")
      .limit(6)
      .lean();

    // Channels se hints
    const channelHints = await Channel.find({
      $or: [{ name: regex }, { handle: regex }],
    })
      .select("name handle")
      .limit(4)
      .lean();

    const hints = [
      ...videoHints.map((v) => ({
        type: "video",
        text: v.title,
      })),
      ...channelHints.map((c) => ({
        type: "channel",
        text: c.name || c.handle,
      })),
    ];

    // unique + limit
    const unique = [];
    const seen = new Set();
    for (const h of hints) {
      const key = h.text.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(h);
      }
      if (unique.length >= 8) break;
    }

    res.status(200).json({
      success: true,
      data: unique,
    });
  } catch (err) {
    console.error("Search hints error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hints",
    });
  }
};

module.exports = {
  getAllVideos,
  getVideoById,
  addView,
  likeVideo,
  dislikeVideo,
  addComment,
  getComments,
  deleteComment,
  getVideoInteraction,
  createChannel,
  getChannels,
  getSubscribedChannels,
  getChannelById,
  getUserWatchHistory,
  getUserLikedVideos,
  getUserWatchLaterVideos,
  getUserUploadedVideos,
  getvideosByChannel,
  deleteChannel,
  uploadVideo,
  recommendedVideos,
  trendingVideos,
  LatestVideos,
  trendingShorts,
  topShorts,
  subscribeChannel,
  getSubscribedVideos,
  HistoricalVideos,
  LikedVideos,
  WatchLaterVideos,
  RemoveFromWatchLater,
  addToWatchLater,
  getSearchHints,
};
