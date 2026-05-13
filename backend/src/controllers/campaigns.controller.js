const prisma = require("../lib/prisma");

const nodemailer =
  require("nodemailer");

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },
  });

async function createCampaign(
  req,
  res
) {
  try {
    const userId =
      req.user.id ||
      req.user.sub;

    const {
      name,
      subject,
      content,
      templateId,
      contactListId,
      scheduledAt,
    } = req.body;

    const campaign =
      await prisma.campaign.create({
        data: {
          userId,

          name,

          subject,

          content,

          templateId:
            templateId || null,

          contactListId,

          scheduledAt: scheduledAt
            ? new Date(
                scheduledAt
              )
            : null,

          status: scheduledAt
            ? "scheduled"
            : "draft",

          emailsSent: 0,

          opens: 0,

          clicks: 0,
        },
      });

    return res.status(201).json(
      campaign
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Failed to create campaign",

      error:
        error.message,
    });
  }
}

async function getCampaigns(
  req,
  res
) {
  try {
    const userId =
      req.user.id ||
      req.user.sub;

    const campaigns =
      await prisma.campaign.findMany({
        where: {
          userId,
        },

        include: {
          template: true,

          contactList: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.json(
      campaigns
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Failed to fetch campaigns",

      error:
        error.message,
    });
  }
}

async function sendCampaign(
  req,
  res
) {
  try {
    const { id } =
      req.params;

    console.log(
      "Sending campaign:",
      id
    );

    const campaign =
      await prisma.campaign.findUnique(
        {
          where: {
            id,
          },

          include: {
            contactList: {
              include: {
                members: {
                  include: {
                    contact: true,
                  },
                },
              },
            },
          },
        }
      );

    if (!campaign) {
      return res.status(404).json({
        message:
          "Campaign not found",
      });
    }

    const members =
      campaign.contactList
        ?.members || [];

    if (
      members.length === 0
    ) {
      return res.status(400).json({
        message:
          "No contacts in selected list",
      });
    }

    let sentCount = 0;

    for (const member of members) {
      const contact =
        member.contact;

      if (!contact?.email)
        continue;

      if (
        contact.unsubscribed
      )
        continue;

      const personalizedContent =
        campaign.content
          .replace(
            /{{firstName}}/g,
            contact.firstName ||
              "User"
          )
          .replace(
            /{{lastName}}/g,
            contact.lastName ||
              ""
          )
          .replace(
            /{{email}}/g,
            contact.email
          );

      const unsubscribeUrl =
        `${process.env.BACKEND_URL}/unsubscribe/${contact.id}`;

      const trackingPixel = `
        <img
          src="${process.env.BACKEND_URL}/track/${campaign.id}/${contact.id}"
          width="1"
          height="1"
          style="display:none"
        />
      `;

      const finalHtml = `
        <div style="
          font-family:Arial,sans-serif;
          line-height:1.6;
          color:#111827;
        ">
          ${personalizedContent}

          ${trackingPixel}

          <div style="
            margin-top:40px;
            padding-top:20px;
            border-top:1px solid #e5e7eb;
            text-align:center;
          ">
            <p style="
              color:#6b7280;
              font-size:13px;
              margin-bottom:10px;
            ">
              You are receiving this email because you are subscribed to our campaigns.
            </p>

            <a
              href="${unsubscribeUrl}"
              style="
                color:#2563eb;
                font-size:13px;
                text-decoration:underline;
              "
            >
              Unsubscribe
            </a>
          </div>
        </div>
      `;

      try {
        const info =
          await transporter.sendMail(
            {
              from:
                process.env.EMAIL_USER,

              to: contact.email,

              subject:
                campaign.subject,

              html: finalHtml,
            }
          );

        console.log(
          "EMAIL SENT:",
          info.response
        );

        sentCount++;
      } catch (emailError) {
        console.log(
          "EMAIL ERROR:",
          emailError
        );
      }
    }

    await prisma.campaign.update(
      {
        where: {
          id,
        },

        data: {
          status:
            "completed",

          emailsSent:
            sentCount,
        },
      }
    );

    return res.json({
      message:
        "Campaign sent successfully",

      emailsSent:
        sentCount,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message:
        "Failed to send campaign",

      error:
        error.message,
    });
  }
}

async function deleteCampaign(
  req,
  res
) {
  try {
    const campaignId =
      req.params.id;

    await prisma.emailEvent.deleteMany(
      {
        where: {
          campaignId,
        },
      }
    );

    await prisma.emailOpen.deleteMany(
      {
        where: {
          campaignId,
        },
      }
    );

    await prisma.campaign.delete(
      {
        where: {
          id: campaignId,
        },
      }
    );

    return res.json({
      message:
        "Campaign deleted",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message:
        "Failed to delete campaign",

      error:
        error.message,
    });
  }
}

module.exports = {
  createCampaign,

  getCampaigns,

  sendCampaign,

  deleteCampaign,
};
