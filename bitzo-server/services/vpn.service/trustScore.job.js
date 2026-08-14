const cron = require("node-cron");
const User = require("../../models/usermodel");
const FraudEvent = require("../../models/FraudEventModel");

function startTrustScoreJob() {
  // Har 10 minute pe
  cron.schedule("*/10 * * * *", async () => {
    try {
      console.log("[TrustScore Job] Running...");

      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const users = await User.find({}).select("_id trustScore");

      for (const user of users) {
        const events = await FraudEvent.find({
          userId: user._id,
          createdAt: { $gte: last24h },
        }).select("riskScoreImpact");

        let totalImpact = 0;
        events.forEach((e) => {
          totalImpact += e.riskScoreImpact || 0;
        });

        // Natural recovery: +2 points every 10 min if no recent high impact
        const recovery = totalImpact === 0 ? 2 : 0;
        const newScore = Math.max(
          0,
          Math.min(100, user.trustScore - totalImpact + recovery)
        );

        if (newScore !== user.trustScore) {
          await User.updateOne(
            { _id: user._id },
            { $set: { trustScore: newScore } }
          );
        }
      }

      console.log("[TrustScore Job] Completed");
    } catch (err) {
      console.error("[TrustScore Job] Error:", err.message);
    }
  });
}

module.exports = { startTrustScoreJob };