const cron = require("node-cron");

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

cron.schedule(
  "* * * * *",
  async () => {
    try {
      console.log(
        "Checking scheduled campaigns..."
      );

      const campaigns =
        await prisma.campaign.findMany(
          {
            where: {
              status:
                "scheduled",

              scheduledAt: {
                lte: new Date(),
              },
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

      for (const campaign of campaigns) {
        let sentCount = 0;

        const members =
          campaign.contactList
            ?.members || [];

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
            `http://localhost:5000/unsubscribe/${contact.id}`;

          const trackingPixel = `
            <img
              src="http://localhost:5000/track/${campaign.id}/${contact.id}"
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

          sentCount++;
        }

        await prisma.campaign.update(
          {
            where: {
              id: campaign.id,
            },

            data: {
              status:
                "completed",

              emailsSent:
                sentCount,
            },
          }
        );

        console.log(
          `Scheduled campaign sent: ${campaign.name}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
);