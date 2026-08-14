const { verifyAccessToken } = require("../utils/tokenService");

const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    // ✅ Normalize to always have both .id and .userId available
    const userId = decoded.sub || decoded.userId || decoded.id || decoded._id;
    req.user = {
      ...decoded,
      userId,
      id: userId,
    };

    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or expired token",
    });
  }
};

module.exports = isAuthenticated;
