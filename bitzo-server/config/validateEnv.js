const JWT_SECRET_MIN_LENGTH = 32;

// Boot-critical credentials: the server cannot start without these.
const REQUIRED_VARS = [
  "MONGO_URI",
  "IMAGEKIT_PUBLIC_KEY",
  "IMAGEKIT_PRIVATE_KEY",
  "IMAGEKIT_URL_ENDPOINT",
];

const validateEnv = () => {
  const missing = [];

  if (!process.env.JWT_SECRET) {
    missing.push("JWT_SECRET");
  } else if (process.env.JWT_SECRET.length < JWT_SECRET_MIN_LENGTH) {
    console.error(
      `[validateEnv] JWT_SECRET is too weak: ${process.env.JWT_SECRET.length} characters (min ${JWT_SECRET_MIN_LENGTH}). ` +
        "Generate a strong secret, e.g.: node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""
    );
    process.exit(1);
  }

  if (
    process.env.REFRESH_TOKEN_SECRET &&
    process.env.REFRESH_TOKEN_SECRET.length < JWT_SECRET_MIN_LENGTH
  ) {
    console.error(
      `[validateEnv] REFRESH_TOKEN_SECRET is too weak: ${process.env.REFRESH_TOKEN_SECRET.length} characters (min ${JWT_SECRET_MIN_LENGTH}). ` +
        "Generate a strong secret, e.g.: node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""
    );
    process.exit(1);
  }

  if (
    process.env.NODE_ENV === "production" &&
    !process.env.REFRESH_TOKEN_SECRET
  ) {
    console.error(
      "[validateEnv] REFRESH_TOKEN_SECRET is required in production (minimum 32 characters)."
    );
    process.exit(1);
  }

  if (
    process.env.NODE_ENV === "production" &&
    process.env.ADMIN_REGISTER_KEY &&
    process.env.ADMIN_REGISTER_KEY.length < 8
  ) {
    console.error(
      "[validateEnv] ADMIN_REGISTER_KEY is too weak (minimum 8 characters)."
    );
    process.exit(1);
  }

  REQUIRED_VARS.forEach((name) => {
    if (!process.env[name]) {
      missing.push(name);
    }
  });

  if (missing.length > 0) {
    console.error(`[validateEnv] Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
};

module.exports = validateEnv;
