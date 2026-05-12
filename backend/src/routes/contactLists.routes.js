const express = require("express");

const {
  protect,
} = require(
  "../middleware/auth.middleware"
);

const prisma = require(
  "../lib/prisma"
);

const router =
  express.Router();

router.use(protect);

router.get(
  "/",
  async (req, res) => {
    try {
      const lists =
        await prisma.contactList.findMany(
          {
            where: {
              userId:
                req.user.id,
            },
          }
        );

      res.json(lists);
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to fetch lists",
      });
    }
  }
);

router.post(
  "/",
  async (req, res) => {
    try {
      const {
        name,
        description,
      } = req.body;

      const list =
        await prisma.contactList.create(
          {
            data: {
              name,
              description,
              userId:
                req.user.id,
            },
          }
        );

      res.status(201).json(
        list
      );
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to create list",
      });
    }
  }
);

module.exports = router;