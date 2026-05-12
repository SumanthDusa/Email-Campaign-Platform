const prisma = require("../lib/prisma");

async function getAnalytics(
  req,
  res
) {
  try {
    const userId =
      req.user.sub ||
      req.user.id;

    const totalContacts =
      await prisma.contact.count({
        where: {
          userId,
        },
      });

    const unsubscribedContacts =
      await prisma.contact.count({
        where: {
          userId,
          unsubscribed: true,
        },
      });

    const activeContacts =
      await prisma.contact.count({
        where: {
          userId,
          unsubscribed: false,
        },
      });

    const totalCampaigns =
      await prisma.campaign.count({
        where: {
          userId,
        },
      });

    const totalLists =
      await prisma.contactList.count({
        where: {
          userId,
        },
      });

    const userCampaigns =
      await prisma.campaign.findMany(
        {
          where: {
            userId,
          },

          select: {
            id: true,
          },
        }
      );

    const campaignIds =
      userCampaigns.map(
        (campaign) =>
          campaign.id
      );

    let totalEmailOpens = 0;

    if (
      campaignIds.length > 0
    ) {
      totalEmailOpens =
        await prisma.emailOpen.count(
          {
            where: {
              campaignId: {
                in: campaignIds,
              },
            },
          }
        );
    }

    return res.json({
      totalContacts,

      activeContacts,

      unsubscribedContacts,

      totalCampaigns,

      totalLists,

      totalEmailOpens,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message:
        "Failed to fetch analytics",

      error:
        error.message,
    });
  }
}

module.exports = {
  getAnalytics,
};