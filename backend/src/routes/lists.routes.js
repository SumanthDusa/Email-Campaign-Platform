const express = require("express");

const {
  getLists,
  createList,
  deleteList,
} = require("../controllers/lists.controller");

const {
  authenticateToken,
} = require("../middleware/auth");

const router = express.Router();

router.use(authenticateToken);

router.get("/", getLists);

router.post("/", createList);

router.delete("/:id", deleteList);

module.exports = router; 