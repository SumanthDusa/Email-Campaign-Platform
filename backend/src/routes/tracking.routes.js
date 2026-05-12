const express = require("express");

const prisma = require("../lib/prisma");

const router = express.Router();

router.get(
  "/:campaignId/:contactId",
  
  async (req, res) => {
    try {
      const {
        campaignId,
        contactId,
      } = req.params;

      const existing =
        await prisma.emailOpen.findFirst(
          {
            where: {
              campaignId,
              contactId,
            },
          }
        );

      if (!existing) {
        await prisma.emailOpen.create(
          {
            data: {
              campaignId,
              contactId,
            },
          }
        );

        await prisma.campaign.update(
          {
            where: {
              id: campaignId,
            },

            data: {
              opens: {
                increment: 1,
              },
            },
          }
        );
      }

      const pixel =
        Buffer.from(
          "R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
          "base64"
        );

      res.set(
        "Content-Type",
        "image/gif"
      );

      return res.send(pixel);
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .end();
    }
  }
);

module.exports = router;