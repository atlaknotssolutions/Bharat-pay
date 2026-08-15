const cron = require("node-cron");
const User = require("../../models/usermodel");
const FraudEvent = require("../../models/FraudEventModel");

let trustScoreJobRunning = false;

function startTrustScoreJob() {
  cron.schedule(
    "*/10 * * * *",
    async () => {
      if (trustScoreJobRunning) {
        console.warn("[TrustScore Job] Skipping overlapping run");
        return;
      }

      trustScoreJobRunning = true;
      const startedAt = Date.now();

      try {
        console.log("[TrustScore Job] Running...");

        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const users = await User.find({}).select("_id trustScore").lean();

        for (const user of users) {
          const events = await FraudEvent.find({
            userId: user._id,
            createdAt: { $gte: last24h },
          }).select("riskScoreImpact");

          let totalImpact = 0;
          for (const event of events) {
            totalImpact += event.riskScoreImpact || 0;
          }

          const recovery = totalImpact === 0 ? 2 : 0;
          const newScore = Math.max(
            0,
            Math.min(
              100,
              Number(user.trustScore || 0) - totalImpact + recovery,
            ),
          );

          if (newScore !== Number(user.trustScore || 0)) {
            await User.updateOne(
              { _id: user._id },
              { $set: { trustScore: newScore } },
            );
          }
        }

        console.log(
          `[TrustScore Job] Completed in ${Date.now() - startedAt}ms`,
        );
      } catch (err) {
        console.error("[TrustScore Job] Error:", err.message);
      } finally {
        trustScoreJobRunning = false;
      }
    },
    { timezone: "Asia/Kolkata" },
  );
}

module.exports = { startTrustScoreJob };
