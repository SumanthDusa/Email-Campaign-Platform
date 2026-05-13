const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || "change-me",
  smtpEmail: process.env.EMAIL_USER || "",
  smtpPassword: process.env.EMAIL_PASS || "",
  emailBatchSize: Number(process.env.EMAIL_BATCH_SIZE || 25),
};

module.exports = env;
