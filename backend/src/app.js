const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const protectedRoutes = require("./routes/protected.routes");
const listRoutes = require("./routes/lists.routes");
const contactRoutes = require("./routes/contacts.routes");
const campaignRoutes = require("./routes/campaigns.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/contacts-lists", listRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/campaigns", campaignRoutes);

module.exports = app;
