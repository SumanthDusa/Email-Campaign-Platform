require("dotenv").config();
require("./jobs/campaignScheduler");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const contactsRoutes = require("./routes/contacts.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});
const listsRoutes =
  require("./routes/lists.routes");

app.use(
  "/api/contact-lists",
  listsRoutes
);
const campaignsRoutes =
  require("./routes/campaigns.routes");

app.use(
  "/api/campaigns",
  campaignsRoutes
);

const analyticsRoutes =
  require(
    "./routes/analytics.routes"
  );

app.use(
  "/api/analytics",
  analyticsRoutes
);

const templateRoutes =
  require(
    "./routes/templates.routes"
  );

app.use(
  "/api/templates",
  templateRoutes
);

const unsubscribeRoutes =
  require("./routes/unsubscribe.routes");


app.use(
  "/unsubscribe",
  unsubscribeRoutes
);

const trackingRoutes =
  require("./routes/tracking.routes");

app.use(
  "/track",
  trackingRoutes
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
