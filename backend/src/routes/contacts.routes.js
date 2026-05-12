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

router.post(
  "/",
  async (req, res) => {
    try {
      const {
        name,
        description,
        contacts,
      } = req.body;

      const list =
        await prisma.contactList.create(
          {
            data: {
              name,
              description,

              userId:
                req.user.sub,

              members: {
                create:
                  contacts.map(
                    (
                      contactId
                    ) => ({
                      contactId,
                    })
                  ),
              },
            },
          }
        );

      res.status(201).json(
        list
      );
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to create list",
      });
    }
  }
);

router.delete(
  "/:id",
  deleteContact
);

module.exports = router;