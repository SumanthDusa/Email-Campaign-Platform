const express = require("express");

const {
  protect,
} = require(
  "../middleware/auth.middleware"
);

const {
  createCampaign,
  getCampaigns,
  sendCampaign,
  deleteCampaign,
} = require(
  "../controllers/campaigns.controller"
);

const router = express.Router();

router.use(protect);

router.get(
  "/",
  getCampaigns
);

router.post(
  "/",
  createCampaign
);

router.post(
  "/:id/send",
  sendCampaign
);

router.delete(
  "/:id",
  deleteCampaign
);


module.exports = router;