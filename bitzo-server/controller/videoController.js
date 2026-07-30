const Video = require("../models/Videomodel");

const fs = require("fs");

/**
 * ✏️ Update Video
 */
exports.updateVideoupdated = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      type,
      duration,
      category,
      subCategory,
    } = req.body;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (type) video.type = type;
    if (duration) video.duration = Number(duration);
    if (category) video.category = category;         // ✅ update category
    if (subCategory) video.subCategory = subCategory; // ✅ update subCategory

    if (req.file) {
      const filePath = req.file.path.replace(/\\/g, "/");
      video.videoUrl = filePath;
    }

    await video.save();

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const fullVideoUrl = `${baseUrl}/${video.videoUrl}`;

    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      video: {
        ...video.toObject(),
        videoUrl: fullVideoUrl,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during update",
      error: error.message,
    });
  }
};




exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    const {
      title,
      description,
      type,
      duration,
      category,
      // subCategory removed
    } = req.body;

    const filePath = req.file.path.replace(/\\/g, "/");

    const video = await Video.create({
      title,
      description: description || "",
      type,
      duration: duration ? Number(duration) : undefined,
      category,            // only category is saved now
      videoUrl: filePath,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const fullVideoUrl = `${baseUrl}/${filePath}`;

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      video: {
        ...video.toObject(),
        videoUrl: fullVideoUrl,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during upload",
      error: error.message,
    });
  }
};


exports.getAllVideos = async (req, res) => {
  try {
    // Fetch all videos, populate only category name, newest first
    const videos = await Video.find()
      .populate("category", "name")        // only category name
      .sort({ createdAt: -1 });

    // Get the base URL for the server
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Add full video URL for frontend consumption
    const updatedVideos = videos.map((video) => {
      const videoObj = video.toObject();
      return {
        ...videoObj,
        videoUrl: `${baseUrl}/${videoObj.videoUrl}`, // assuming videoUrl is stored as relative path
      };
    });

    res.status(200).json({
      success: true,
      count: updatedVideos.length,
      videos: updatedVideos,
    });

  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching videos",
      error: error.message, // optional: only in development
    });
  }
};

exports.editMyVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const {
      title,
      description,
      type,
      duration,
      category,
      subCategory,
    } = req.body;

    // 🔒 Find video owned by logged-in user
    const video = await Video.findOne({
      _id: id,
      creator: userId,
    });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found or not authorized",
      });
    }

    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (type) video.type = type;
    if (duration) video.duration = Number(duration);
    if (category) video.category = category;
    if (subCategory) video.subCategory = subCategory;

    // 🎥 If new video uploaded
    if (req.file) {
      const filePath = req.file.path.replace(/\\/g, "/");
      video.videoUrl = filePath;
    }

    await video.save();

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      video: {
        ...video.toObject(),
        videoUrl: `${baseUrl}/${video.videoUrl}`,
      },
    });
  } catch (error) {
    console.error("Edit my video error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.deleteMyVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // 🔒 Find only user's video
    const video = await Video.findOne({
      _id: id,
      creator: userId,
    });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found or not authorized",
      });
    }

    // 🗑️ Delete video file from server
    if (video.videoUrl && fs.existsSync(video.videoUrl)) {
      fs.unlinkSync(video.videoUrl);
    }

    await video.deleteOne();

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Delete my video error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.getMyVideos = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ current user

    const videos = await Video.find({ creator: userId })
      .populate("category", "name")
      .populate("subCategory", "name")
      .sort({ createdAt: -1 });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const updatedVideos = videos.map((video) => {
      const videoObj = video.toObject();
      return {
        ...videoObj,
        videoUrl: `${baseUrl}/${videoObj.videoUrl}`,
      };
    });

    res.status(200).json({
      success: true,
      count: updatedVideos.length,
      videos: updatedVideos,
    });
  } catch (error) {
    console.error("Get my videos error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * 📄 Get Single Video by ID
 */
exports.getSingleVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    res.status(200).json({
      success: true,
      video
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * 🗑️ Delete Video
 */
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    await video.deleteOne();

    res.status(200).json({
      success: true,
      message: "Video deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



