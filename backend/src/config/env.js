const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || "change-me",
  smtpEmail: process.env.SMTP_EMAIL || "",
  smtpPassword: process.env.SMTP_PASSWORD || "",
  emailBatchSize: Number(process.env.EMAIL_BATCH_SIZE || 25),
};

module.exports = env;
