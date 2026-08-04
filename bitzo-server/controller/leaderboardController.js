const Channel = require("../models/Channel/ChannelModel");
const Video = require("../models/Videomodel");

exports.getLeaderboard = async (req, res) => {
  try {
    const { videoType } = req.query;
    const videoMatch =
      videoType === "short" || videoType === "long"
        ? { videoType }
        : {};

    const creatorDocs = await Channel.aggregate([
      {
        $group: {
          _id: "$creator",
          totalSubscribers: {
            $sum: { $size: { $ifNull: ["$subscribedBy", []] } },
          },
          channels: {
            $push: {
              name: "$name",
              channelImage: "$channelImage",
              subs: { $size: { $ifNull: ["$subscribedBy", []] } },
            },
          },
        },
      },
      { $sort: { totalSubscribers: -1, _id: 1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    ]);

    const topCreators = creatorDocs.map((doc, index) => {
      const bestChannel = (doc.channels || []).reduce(
        (best, channel) =>
          !best || channel.subs > best.subs ? channel : best,
        null,
      );
      return {
        id: doc._id,
        name: doc.user?.name ?? null,
        avatar: doc.user?.avatar ?? null,
        channelName: bestChannel?.name ?? null,
        totalSubscribers: doc.totalSubscribers || 0,
        rewardPoints: doc.user?.rewardPoints ?? 0,
        trustScore: doc.user?.trustScore ?? 0,
        rank: index + 1,
      };
    });

    const videoDocs = await Video.aggregate([
      { $match: videoMatch },
      { $sort: { views: -1, _id: 1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "channels",
          localField: "channel",
          foreignField: "_id",
          as: "channel",
        },
      },
      { $unwind: { path: "$channel", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "channel.creator",
          foreignField: "_id",
          as: "creator",
        },
      },
      { $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } },
    ]);

    const topVideos = videoDocs.map((doc, index) => ({
      id: doc._id,
      title: doc.title,
      thumbnail: doc.thumbnail ?? null,
      views: doc.views || 0,
      channelName: doc.channel?.name ?? null,
      creatorName: doc.creator?.name ?? null,
      videoType: Array.isArray(doc.videoType)
        ? doc.videoType[0] ?? null
        : doc.videoType ?? null,
      rank: index + 1,
    }));

    res.status(200).json({
      success: true,
      data: { topCreators, topVideos },
    });
  } catch (error) {
    console.error("getLeaderboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
