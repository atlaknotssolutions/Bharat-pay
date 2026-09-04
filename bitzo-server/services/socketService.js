let io = null;

function attachSocketServer(socketServer) {
  io = socketServer;

  io.on("connection", (socket) => {
    const userId = socket.authenticatedUserId;
    if (userId) socket.join(`user:${userId}`);
  });
}

function emitTrustScoreUpdated(userId, scoreLog, trustTier, adAccess) {
  if (!io || !userId || !scoreLog) return;
  io.to(`user:${userId}`).emit("trust-score-updated", {
    userId: String(userId),
    trustScore: scoreLog.newScore,
    previousScore: scoreLog.previousScore,
    changeAmount: scoreLog.changeAmount,
    eventType: scoreLog.eventType,
    reason: scoreLog.reason,
    trustTier,
    adAccess,
    updatedAt: scoreLog.createdAt || new Date(),
  });
}

module.exports = { attachSocketServer, emitTrustScoreUpdated };
