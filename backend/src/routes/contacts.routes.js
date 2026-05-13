const express = require("express");

const multer = require("multer");

const {
  protect,
} = require(
  "../middleware/auth.middleware"
);

const {
  createContact,
  getContacts,
  importContactsFromCsv,
  deleteContact,
} = require(
  "../controllers/contacts.controller"
);

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.use(protect);

router.get("/", getContacts);

router.post("/", createContact);

router.post(
  "/import",
  upload.single("file"),
  importContactsFromCsv
);

router.delete(
  "/:id",
  deleteContact
);

module.exports = router;
