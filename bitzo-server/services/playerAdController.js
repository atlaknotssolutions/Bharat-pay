const AdImpression = require("../models/AdImpression");
const AdNetwork = require("../models/AdNetwork");

const {
  getAdFromWaterfall,
} = require("../services/waterfallService");


// GET /v1/player/manifest/:video_id
const getPlayerManifest = async (req, res) => {
  try {
    const { video_id } = req.params;

    if (!video_id) {
      return res.status(400).json({
        success: false,
        message: "video_id is required",
      });
    }

    const result =
      await getAdFromWaterfall();

    if (!result) {
      return res.status(200).json({
        success: true,
        videoId: video_id,
        adAvailable: false,
        message: "No advertisement available",
      });
    }

    const {
      network,
      vast,
    } = result;

    return res.status(200).json({
      success: true,

      videoId: video_id,

      adAvailable: true,

      ad: {
        networkId: network._id,
        networkName: network.name,
        provider: network.provider,

        vastUrl: vast.vastUrl,

        vastXml: vast.xml,
      },
    });
  } catch (error) {
    console.error(
      "Manifest Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get ad manifest",
    });
  }
};


// POST /v1/player/ad-impression
const trackAdImpression = async (
  req,
  res
) => {
  try {
    const {
      videoId,
      adId,
      networkId,
      event = "impression",
      sessionId,
      deviceId,
    } = req.body;

    if (!videoId || !networkId) {
      return res.status(400).json({
        success: false,
        message:
          "videoId and networkId are required",
      });
    }

    const network =
      await AdNetwork.findById(networkId);

    if (!network) {
      return res.status(404).json({
        success: false,
        message: "Ad network not found",
      });
    }

    const impression =
      await AdImpression.create({
        videoId,
        adId: adId || null,
        networkId,
        event,
        sessionId:
          sessionId || null,
        deviceId:
          deviceId || null,
      });

    return res.status(201).json({
      success: true,
      message:
        "Ad impression tracked successfully",

      data: {
        id: impression._id,
        videoId: impression.videoId,
        adId: impression.adId,
        networkId: impression.networkId,
        event: impression.event,
        createdAt:
          impression.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Impression Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to track ad impression",
    });
  }
};

module.exports = {
  getPlayerManifest,
  trackAdImpression,
};