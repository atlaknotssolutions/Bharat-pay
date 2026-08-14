const FraudEvent = require("../../models/FraudEventModel");
const User = require("../../models/usermodel");

async function logFraudEvent({
  userId = null,
  eventType,
  severity = "medium",
  ip,
  deviceId,
  userAgent,
  isVPN = false,
  isProxy = false,
  riskScoreImpact = 0,
  metadata = {},
}) {
  try {
    await FraudEvent.create({
      userId,
      eventType,
      severity,
      ip,
      deviceId,
      userAgent,
      isVPN,
      isProxy,
      riskScoreImpact,
      metadata,
    });
  } catch (err) {
    console.error("Failed to log fraud event:", err.message);
  }
}

async function analyzeBehavior(userId) {
  if (!userId) return { riskPoints: 0, reasons: [] };

  const last15Min = new Date(Date.now() - 15 * 60 * 1000);
  const last1Hour = new Date(Date.now() - 60 * 60 * 1000);

  const recent = await FraudEvent.find({
    userId,
    createdAt: { $gte: last1Hour },
  }).lean();

  let riskPoints = 0;
  const reasons = [];

  const failedLogins = recent.filter((e) => e.eventType === "LOGIN_FAILED").length;
  if (failedLogins >= 5) {
    riskPoints += 35;
    reasons.push("Multiple failed logins");
  }

  if (recent.length >= 25) {
    riskPoints += 25;
    reasons.push("Abnormally high activity");
  }

  const vpnEvents = recent.filter((e) => e.isVPN || e.isProxy).length;
  if (vpnEvents >= 1) {
    riskPoints += 20;
    reasons.push("VPN/Proxy detected");
  }

  const uniqueDevices = new Set(recent.map((e) => e.deviceId).filter(Boolean));
  if (uniqueDevices.size > 2) {
    riskPoints += 20;
    reasons.push("Multiple devices in short time");
  }

  return { riskPoints, reasons };
}

async function applyRiskToUser(userId, riskPoints, reasons = []) {
  if (!userId || riskPoints <= 0) return;

  const user = await User.findById(userId);
  if (!user) return;

  const newScore = Math.max(0, Math.min(100, user.trustScore - riskPoints));
  user.trustScore = newScore;

  if (newScore < 30) {
    // optional: auto flag
    // user.isHighRisk = true;
  }

  await user.save();

  if (riskPoints >= 20) {
    await logFraudEvent({
      userId,
      eventType: "TRUST_SCORE_DROP",
      severity: riskPoints >= 40 ? "high" : "medium",
      riskScoreImpact: riskPoints,
      metadata: { reasons, newScore },
    });
  }
}

module.exports = {
  logFraudEvent,
  analyzeBehavior,
  applyRiskToUser,
};