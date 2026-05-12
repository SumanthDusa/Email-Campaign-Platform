const express = require("express");

const {
  protect,
} = require(
  "../middleware/auth.middleware"
);

const {
  createTemplate,
  getTemplates,
  updateTemplate,
  deleteTemplate,
} = require(
  "../controllers/templates.controller"
);

const router =
  express.Router();

router.use(protect);

router.get(
  "/",
  getTemplates
);

router.post(
  "/",
  createTemplate
);

router.put(
  "/:id",
  updateTemplate
);

router.delete(
  "/:id",
  deleteTemplate
);

module.exports = router;