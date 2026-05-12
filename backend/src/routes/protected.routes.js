const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/me", authenticateToken, (req, res) => {
  return res.json({
    message: "Protected profile route",
    user: req.user,
  });
});

router.get("/admin", authenticateToken, authorizeRoles("ADMIN"), (req, res) => {
  return res.json({
    message: "Admin-only protected route",
  });
});

module.exports = router;
