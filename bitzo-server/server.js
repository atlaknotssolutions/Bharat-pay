require("dotenv").config(); // ✅ MUST BE FIRST LINE

require("./config/validateEnv")();

const {
  startTrustScoreJob,
} = require("./services/vpn.service/trustScore.job.js");

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("node:path");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const authRoutes = require("./routes/authRoute.js");
const adminRoute = require("./routes/AdminRoute/AdminRoute.js");
const videoRoutes = require("./routes/VideoRoutes.js");
const userRoutes = require("./routes/userVideoRoute.js");
const categoryRouter = require("./routes/categoryRoute/category.route.js");
const leaderboardRoute = require("./routes/leaderboardRoute.js");
const notificationRoutes = require("./routes/notificationRoute.js");

const {
  detectVPN,
} = require("./services/vpn.service/vpn.service.js");

const app = express();

const PORT = process.env.PORT || 8000;

// =====================================================
// MORGAN - REQUEST LOGGING
// =====================================================

// Never log plaintext credentials/tokens in request bodies.
morgan.token("body", (req) => {
  try {
    const body = { ...(req.body || {}) };

    for (const key of [
      "password",
      "newPassword",
      "oldPassword",
      "token",
      "resetToken",
      "credential",
      "registerKey",
    ]) {
      if (body[key] !== undefined) {
        body[key] = "[REDACTED]";
      }
    }

    return JSON.stringify(body);
  } catch (_) {
    return "{}";
  }
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body"
  )
);

// =====================================================
// MONGODB
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// =====================================================
// MIDDLEWARES
// =====================================================

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.use(
  fileUpload({
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    abortOnLimit: true,
    useTempFiles: false,
  })
);

app.use(cookieParser());

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: true,
    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
      "HEAD",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],

    exposedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// =====================================================
// STATIC FILES
// =====================================================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// =====================================================
// ROUTES
// =====================================================

app.use("/api", authRoutes);

app.use(
  "/api/category",
  categoryRouter
);

app.use(
  "/api/admin",
  adminRoute
);

app.use(
  "/api/adminvideo",
  videoRoutes
);

app.use(
  "/api/uservideo",
  userRoutes
);

app.use(
  "/api/leaderboard",
  leaderboardRoute
);

app.use(
  "/api/notifications",
  notificationRoutes
);

// =====================================================
// TEMPORARY VPN TEST ROUTE
// =====================================================

app.use("/test-vpn", async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.headers["x-real-ip"] ||
      req.ip ||
      "unknown";

    const result = await detectVPN(ip);

    res.json({
      ip,
      ...result,
    });
  } catch (error) {
    console.error("❌ VPN Detection Error:", error);

    res.status(500).json({
      success: false,
      message: "VPN detection failed",
    });
  }
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully");
});

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// =====================================================
// TRUST SCORE JOB
// =====================================================

startTrustScoreJob();

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});