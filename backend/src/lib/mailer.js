const nodemailer = require("nodemailer");
const env = require("../config/env");

let transporter = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.smtpEmail,
      pass: env.smtpPassword,
    },
  });

  return transporter;
}

module.exports = {
  getTransporter,
};
