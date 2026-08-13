const express = require("express");

const {
  getPlayerManifest,
  trackAdImpression,
} = require("../controllers/playerAdController");

const router = express.Router();

router.get(
  "/manifest/:video_id",
  getPlayerManifest
);

router.post(
  "/ad-impression",
  trackAdImpression
);

module.exports = router;