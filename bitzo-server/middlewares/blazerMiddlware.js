const multer = require("multer");
const B2 = require("backblaze-b2");

const b2 = new B2({
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
  applicationKey: process.env.B2_APPLICATION_KEY,
});

console.log(
  "Backblaze Keys - ID:",
  process.env.B2_APPLICATION_KEY_ID ? "LOADED" : "MISSING",
  "KEY:",
  process.env.B2_APPLICATION_KEY ? "LOADED" : "MISSING"
);
// ================= MULTER =================
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    if (
      file.fieldname === "video" &&
      file.mimetype.startsWith("video/")
    ) {
      cb(null, true);
    } else if (
      file.fieldname === "thumbnail" &&
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

// ================= BACKBLAZE MIDDLEWARE =================
const uploadToBackblaze = [
  // 1️⃣ Parse multipart form
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),

  // 2️⃣ Upload to Backblaze
  async (req, res, next) => {
    try {
      if (!req.files || !req.files.video) {
        return res.status(400).json({
          success: false,
          message: "Video file is required",
        });
      }

      await b2.authorize();

      const { data: uploadUrlData } = await b2.getUploadUrl({
        bucketId: process.env.B2_BUCKET_ID,
      });

      const videoFile = req.files.video[0];
      const fileName = `videos/${Date.now()}-${videoFile.originalname}`;

      await b2.uploadFile({
        uploadUrl: uploadUrlData.uploadUrl,
        uploadAuthToken: uploadUrlData.authorizationToken,
        fileName,
        data: videoFile.buffer,
        mime: videoFile.mimetype,
      });

      const videoUrl = `${process.env.B2_PUBLIC_BUCKET_URL}/${fileName}`;

      // attach for controller
      req.uploadedVideo = {
        url: videoUrl,
        fileName,
        mimeType: videoFile.mimetype,
        size: videoFile.size,
      };

      // thumbnail (optional)
      if (req.files.thumbnail) {
        req.uploadedVideo.thumbnail = req.files.thumbnail[0];
      }

      next();
    } catch (err) {
      console.error("Backblaze upload error:", err);
      return res.status(500).json({
        success: false,
        message: "Backblaze upload failed",
        error: err.message,
      });
    }
  },
];

module.exports = uploadToBackblaze;
